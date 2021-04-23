# DuckDuckGo Autofill

This code is imported as a subrepo by our [extension](https://github.com/duckduckgo/duckduckgo-privacy-extension) and native apps ([iOS](https://github.com/duckduckgo/iOS) and [Android](https://github.com/duckduckgo/Android)).

DuckDuckGo Autofill is distributed under the Apache 2.0 [License](LICENSE.md).

## How to add this repo to another project
###### [See the docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules#_starting_submodules)

To add this repo as a submodule, run:

```shell
git submodule add https://github.com/duckduckgo/duckduckgo-autofill
git config -f .gitmodules submodule.duckduckgo-autofill.branch main
```

Then you add the Git artifacts to the parent project and commit.

## How to develop this code in the context of another project
###### [See the docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules#_working_on_a_submodule)

By default git submodules are in a detached HEAD state. This means that there isn't a proper branch to keep track of changes and running `git submodule update` can overwrite your changes, even if you committed them.

So, the first thing to do when working on the submodule is to checkout a branch (new or existing).

```shell
# from the parent project
cd duckduckgo-autofill/
git checkout myname/my-feature
```

You can now work on your code and commit it as usual. If you want to pull changes from upstream, you must run:

```shell
# got back to the parent project
cd ..
git submodule update --remote --merge # or --rebase
```

If you don't pass `--merge` or `--rebase`, Git will revert to a detached HEAD with the remote content. Don't worry, though, your changes are still in your branch and you can check it out again.

## How to push the changes upstream
###### [See the docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules#_publishing_submodules)

Once you check out a specific branch, the submodule works as a normal git repo. You can commit, push and pull from the remote.

Parent projects are setup to track the `main` branch of this repo, so just follow the usual workflow of opening a PR against `main`.

Once merged, consumer projects will run `git submodule update --remote --merge` to include these new changes.
