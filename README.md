# shell-script-tinkering

This scaffolding tool makes use of npm workspaces to keep each individual site as its own manageable package. This is important for any git operations.

# Creating a site

```
npm run create:site <site> <repository>
```

The script is designed to be non-destructive in nature. This means that you can run the same script as many times as you want and it will find any destructive steps and give you the option to either redo that segment of the operation or keep it as-is and proceed in an interactive command line interface.

# Updating a site

```
npm run update:site <site>
```

This will take any updates from the _templateFolder_ (which defaults to `jhbase`) and apply it to the given site and create a branch that is subsequently pushed up to the given repository.

# TODO

- Roll-back Transactions

If a failure occurs we should be able to roll-back all our actions.

- Remove site

We should be able to remove sites that we no longer want so it cleans up all configurations and file system of trailing information.