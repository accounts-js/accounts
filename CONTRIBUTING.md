# Contributing to Accounts

**TL;DR; Tests, coverage, linting, changelog** (See Pull Request Requirements, below).

The Accounts project was intended - since its inception - to be a community maintained project.  We would love to see you get involved (especially long time contributors from the Meteor community who we've worked with before).

## Getting Started

1. Fork the project on Github (top right on the project page)
1. Clone the project: `git clone git@github.com:yourname/accounts`
1. Checkout a relevant branch like: `git checkout some-branch`
1. Create your own feature branch: `git checkout -b proposed-feature`

## Development
[Install Node.js](https://nodejs.org/en/download/) to get access to `npm`.

#### Useful Commands:
* Install project dependencies: `npm i`
* Link together all packages: `npm run link`
* Watch the packages for changes and recompile: `npm start`
* If you want to use the Account project in your own project, use `npm link`:
  1. In your cloned directory: `sudo npm link`
  1. In your app / project: `npm start` followed by `npm link @accounts/accounts`

## Pull Requests

### Requirements

For non-bug-fixes, please open an *issue* first and discuss your idea to make sure we're on the same page.  
Alternatively, prepend your PR title with `[discuss]` to have a conversation around the code.

#### All PRs:

1. Must not break the **test suite** (`npm test`), nor reduce **test coverage** (`npm run coverage`).  If you're fixing a bug, include a test that would fail without your fix.

1. Must respect the **.eslintrc** (`npm run lint`).  Ideally your editor supports `eslint`.  Especially since the project is quite new, feel free to query default rules with us that don't make sense, or disable rules in a particular scope when it makes sense, together with a comment explaining why.

1. Must update the **CHANGELOG.md** file, in the `Unreleased` section at the top, in the format of keepachangelog.com (**@mention** yourself at the end of the line).

1. Must be **isolated**. Avoid grouping many, unrelated changes in a single PR.

1. GitHub now allows auto-squashing of commits in a PR, so no need to rebase your commits before final submission.

### Submission

1. From [Getting Started](#getting-started), your work should ideally be in its own feature branch.
1. `git push` your branch to git and create a new pull request for the appropriate branch. 

## Contributors with Commit Bit

* Should still submit a PR for changes (i.e. no work should be done on a branch directly; all work should be done in it's own separate feature branch), which should be okayed by one other team member before merging.

* Should squash merged PRs whenever possible (via GitHub options).
