# zod-rpc

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

Each platform can implement this to customise how requests/notifications are made.

```javascript
class AppleTransport extends Transport {
    async send (rpc) {
        return wkSendAndWait(rpc.method, rpc.params, {
            secret: this.config.secret,
            hasModernWebkitAPI: this.config.hasModernWebkitAPI
        })
    }
}
// create the instance of the transport
const transport = new AppleTransport(globalConfig);

// create the instance of IOHandler
const io = new IOHandler(transport);

// notify gives no response
await io.notify(from('showAutofillParent', {foo: "bar"}));

// request will deliver a response
const result = io.request(from('showAutofillParent', {foo: "bar"}));
```

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
const rpc = from("storeFormData");

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
const rpc = from("storeFormData")

// Fire and forget notification 
handler.notify(rpc)
```


