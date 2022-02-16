## DDG Password API

A single `generate()` method is exposed from this module.

You can do the following with it

1: Generate a password based on DuckDuckGo's default settings
2: Generate a password from a 'passwordrules' attribute string
3: Lookup known password rules from the [resources provided by Apple](https://github.com/apple/password-manager-resources)


```javascript
const password = require("@duckduckgo/autofill/packages/password");

// generate a password with default settings
const pw = password.generate()

// generate a password with a given input, falling back to default
const pw = password.generate({ input: "minlength: 30; required: lower, upper;"})

// generate a password with rules from a known domain, falling back to default
const pw = password.generate({ domain: "example.com" })
```

# DDG Default Rules

With no parameters, the generate function will use the following character set

```
abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789
```

Along with the following password rules

```
minlength: 20; maxlength: 30;
```

Which currently produces passwords in this format:

```
N3xeFEQf3yiXy3V1msa2
iHjs07Xj64nWfiNrm1nB
pN14zIYhSE0Q6iFuAhcd
QEu6bhPA0MhZ0BhrkaWI
iKub0kcgzrUFdfWdGKdg
jnhChxEtZ7tU4dhUTaHw
DDXNhKaSv7ufabwKfeLP
VmJ1IdUmvqERkdEY2I7A
8xKpY2NsLf4dn1zUMinB
I08cqi3ZyQz3mQHevfNU
```

Note, these are all 20 characters because the generation continues until it finds a password that suits
the rule - in this case the rule is the basic character set so is always matched.

For example, the following rules

```
minlength: 10; maxlength: 30; required: [$]; required: upper,lower,digit;
```

Would return results like this, all about 12 chars long, because it took an extra 2 cycles to 
find a matching password with the required `$`

```
XZJZUt$8cBp2
6$7WwRcg9GkJ
PKJFCe$j0UYZ
eZLE$bHMoh50
9vPyhM$QS1D9
km99pG$GJJXR
sPMpe$AP7svJ
YY$7Dymsi26f
qg$WaLvfGeVh
mGW9m2D97Z$x
```
