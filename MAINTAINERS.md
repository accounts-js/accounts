# Maintainers Guide

> This guide is intended for maintainers

## Creating a new release

1. Merge the changeset pull request
2. Locally git pull the master branch
3. Run `pnpm run compile`
4. Run `pnpx lerna publish from-package` to publish the packages to npm
