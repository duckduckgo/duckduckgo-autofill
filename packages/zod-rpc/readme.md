# zod-rpc

## RPC calls

### 1 Create a new RPC call that **requires** a response

In any file, create a class with the following structure, note that the `validator` here would
be located in a sibling file with the `.zod.js` extension. This is how we are able to strip validation
for the production builds.

```js
import { ZodRPC } from "../packages/zod-rpc";

// These need to be in a separate file with the *.zod.js extension
const paramsValidator = z.object({name: z.string()});
const resultValidator = z.object({name: z.string()});

/** @extends {ZodRPC<paramsValidator, resultValidator>} */
class Login extends ZodRPC {
    method = "loginUser"
    id = "loginUserResponse"
    paramsValidator = paramsValidator
    resultValidator = resultValidator
}

const result = await ioHandler.request(new Login({name: "dax"}))
```

Explanation:
* `/** @extends {ZodRPC<paramsValidator, resultValidator>} */` is how we can forward generic parameters when using JSDoc with Typescript 
* `class Login extends ZodRPC` creates a class `Logic` that inherits all the functionality of a ZodRPC call (validation)
* `method = "loginUser"` depending on the platform in question this may be used in various ways
*   - For example, on macOS/iOS the `method` is used to lookup a specific named handler that the native side injects
*   - But on Windows, the `method` is sent via a generic handler such as `postMessage({type: 'Autofill::' + rpc.method})`
* `paramsValidator` this is the Zod Validator used to validate the `params` (outgoing) data
* `resultValidator` this is the Zod Validator used to validate the `result` (incoming) data
 
Please see **Send a request** section for details on how to actually send this  

### 2 Create a new RPC call that does NOT require a response

This is the same process as above, except you do not need to specify an `id` or `resultValidator`.

```javascript
const paramsValidator = z.object({name: z.string()});

/** @extends {ZodRPC<paramsValidator>} */
class Login extends ZodRPC {
    method = "loginUser"
    paramsValidator = paramsValidator
}

ioHandler.notify(new Login({name: "dax"}))
```


### 3 Create an RPC call from a name + data only 

In situations where you just want to quickly create an RPC call, but you don't care/need to have a 
class definition (eg: because you're accepting that you won't be able to use `instanceof` checks late, then 
you can do the following:

```javascript
// create an RPC call inline for simple, untyped messaging
const result = await ioHandler.request(createRpc("isSignedIn"));

// or a notification, with optional data
ioHandler.notify(createRpc("notifyWebApp", { signedIn: true }));

// you can also add validation here
const paramsValidator = z.object({name: z.string()});
const rpc = createRpc("signIn", {name: "dax"}, paramsValidator)
const result = await ioHandler.request(rpc);

// with params + result validation
const paramsValidator = z.object({name: z.string()});
const resultValidator = z.object({success: z.string()});
const rpc = createRpc("signIn", {name: "dax"}, paramsValidator, resultValidator);
const result = await ioHandler.request(rpc);
```

### 4 Send a request/notification

To send a request, you need to have 3 things:

- `Transport` - to handle differences in messaging for each platform
- `IOHandler` - to handle the lifecycle of messaging + validation
- An RPC Call to make

All device interfaces that inherit from `InterfaceProtype` have direct access to `this.io`, which is 
an instance of IOHandler. So if you're working within an existing class, like `AppleDeviceInterface` (for example),
then you can send any RPC calls you like just using `this.io.notify(...)` or `this.io.request(...)`.

```javascript
// a concrete example of how easy it is to use the new RPC system 
class AppleDeviceInterface extends InterfaceProtype {
    // an example of seting a request and waiting for the response
    async getAlias() {
        const { alias } = await this.io.request(createRpc("getAlias"));
    }
    // an example of sending a fire+forget message
    storeFormData() {
        this.io.notify(createRpc("storeFormData", {credentials:{username: ""}}));
    }
}
```

### 6 Use Zod validations without creating an RPC call

If you want to leverage the type safety of Zod outside of RPC calls, you can use the `validate` method,
just be sure to keep the validator code in a `*.zod.js` file so that it can be stripped for production.

**Note:** this will throw in development, it's specifically designed to be a type-safety tool.

```javascript
import { myValidator } from "./validators.zod.js";

const valid = validate({name: 2}, myValidator);
```

## Working with Transports

### 1) Implement a new transport

A `Transport` handles the very last part of browser<->native messaging. The following example is
a cut-down version to show the concept. 

Implementors just override `send(rpc)` and can do whatever is needed on their platform to respond.

```javascript
// an example transport 
class AppleTransport extends Transport {
    async send (rpc) {
        return wkSendAndWait(rpc.method, rpc.params, {
            secret: this.config.secret,
            hasModernWebkitAPI: this.config.hasModernWebkitAPI
        })
    }
}
```

If this Transport is chosen for the current platform, then every call to `this.io.request` and `this.io.notify`
will come through here.

### 2) Debug an existing transport 

Search for anything that `extends Transport` -> there's only a single method implemented, so it should be
straightforward to incorporate logging to see what's going on.

### 3) Make a change to an existing transport 

Once you know of a required change, you may need to update supporting mocks that live within `integration-test/helpers`

---

## Internals

This library contains:

- `ZodRPC` a class that you can extend to model `rpc` calls with validation via `Zod`
- `Transport` each platform can implement to customise how requests & notifications work
- `IOHandler` that you can use to execute requests & notifications

Note: This is designed to roughly follow https://www.jsonrpc.org/specification 

## `ZodRPC`

**Class format**

You should use this format for all *new* RPC calls that are added.

Benefits:
  1) By using a `class` for each new message, we enable powerful type checking (eg: instanceof checks)
  2) The `@extends` comment allows the type-safety to flow through the handling of the requests/notifications 

```javascript
import { ZodRPC } from "./";

// This would be in another file *.zod.js file
const validator = z.object({name: z.string()});

/** @extends {ZodRPC<validator>} */
class Login extends ZodRPC {
    method = "loginUser"
    paramsValidator = validator 
}

// ❌ TS2322: Type 'number' is not assignable to type 'string'.
const data = new Login({name: 2}).validateParams(); 
```

---

## `Transport` 

Please see 'working with transports' above

--- 

## `IOHandler`

`IOHandler` encapsulates the functionality of RPC calls. It's responsible for validating ZodRPC params
and results (in the case of a request)

**request**

```javascript
const handler = new IOHandler({
    send: async (rpc) => {
        console.log(rpc.method, rpc.params);
        return { success: { foo: "bar" } }
    }
})

// Create an RPC message from a method name only
const rpc = createRpc("storeFormData");

// send and wait for response
const result = handler.request(rpc);

// this will print `{ foo: "bar" }`
console.log(result);
```

**notify**

The key difference with a `notification` is that a response will not be waited for. This is a 'fire and forget'
operation.

```javascript
const handler = new IOHandler({
    send: async (rpc) => {
        console.log(rpc.method, rpc.params);
    }
})

// Create an RPC message from a method name only
const rpc = createRpc("storeFormData")

// Fire and forget notification 
handler.notify(rpc)
```


