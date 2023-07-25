## Password Resources

We include the following files within this package:

- [Password Rules](https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/password-rules.json): allows password generation to respect known rules for the websites listed.
- [Shared Credentials](https://raw.githubusercontent.com/apple/password-manager-resources/main/quirks/shared-credentials.json): allows clients to provide passwords across domains of the same company.

## Update the files

Inside this packages folder, `packages/password`, run the following

```shell
npm run files:update
```

## Github Action

We use a Github action to create new PRs when the files become out of sync with Apple's.

It's in the following file: 
- `.github/workflows/check-password-resources.yml`
 
It uses scripts from 
- `packages/password/scripts/update-files-from-remote.js`
