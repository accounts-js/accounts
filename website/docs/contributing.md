---
id: contributing
title: Contributing to accounts-js
sidebar_label: Contributing
---

**TL;DR; Tests, coverage, linting, changelog** (See Pull Request Requirements, below).

The Accounts project was intended - since its inception - to be a community maintained project. We would love to see you get involved (especially long time contributors from the Meteor community who we've worked with before).

## Getting Started

1.  Fork the project on Github (top right on the project page)
2.  Clone the project: `git clone git@github.com:yourname/accounts`
3.  Checkout a relevant branch like: `git checkout some-branch`
4.  Create your own feature branch: `git checkout -b proposed-feature`

## Development

- [Install Node.js](https://nodejs.org/en/download/).
- [Install pnpm](https://pnpm.io/installation).

#### Useful Commands:

- Install project dependencies: `pnpm install`
- Compile the packages `pnpm run compile`
- Watch the packages for changes and recompile: `pnpm run start` (You need to run this command in the package subfolder you are updating)
- Run `docker-compose up -d` to start database services required for tests.
- Run `pnpm run test` to run all the tests.

## Pull Requests

### Requirements

For non-bug-fixes, please open an _issue_ first and discuss your idea to make sure we're on the same page.  
Alternatively, prepend your PR title with `[discuss]` to have a conversation around the code.

#### All PRs:

1.  Must not break the **test suite** (`pnpm run test`), nor reduce **test coverage** (`pnpm run coverage`). If you're fixing a bug, include a test that would fail without your fix.

2.  Must respect the **.eslintrc.js** (`pnpm run test:lint`). Ideally your editor supports `eslint`. Especially since the project is quite new, feel free to query default rules with us that don't make sense, or disable rules in a particular scope when it makes sense, together with a comment explaining why.

3.  Must be **isolated**. Avoid grouping many, unrelated changes in a single PR.

4.  GitHub now allows auto-squashing of commits in a PR, so no need to rebase your commits before final submission.

5.  Must contain a changeset file describing the changes and affected packages. Run `pnpx changeset` to generate one.

### Submission

1.  From [Getting Started](#getting-started), your work should ideally be in its own feature branch.
1.  `git push` your branch to git and create a new pull request for the appropriate branch.

## Contributors with Commit Bit

- Should still submit a PR for changes (i.e. no work should be done on a branch directly; all work should be done in it's own separate feature branch), which should be okayed by one other team member before merging.

- Should squash merged PRs whenever possible (via GitHub options).

## Financial contributions

We also welcome financial contributions in full transparency on our [open collective](https://opencollective.com/accounts-js).
Anyone can file an expense. If the expense makes sense for the development of the community, it will be "merged" in the ledger of our open collective by the core contributors and the person who filed the expense will be reimbursed.

## Credits

### Contributors

Thank you to all the people who have already contributed to accounts-js!
<a href="https://github.com/accounts-js/accounts/graphs/contributors"><img src="https://opencollective.com/accounts-js/contributors.svg?width=890" /></a>

### Backers

Thank you to all our backers! [[Become a backer](https://opencollective.com/accounts-js#backer)]

<a href="https://opencollective.com/accounts-js#backers" target="_blank"><img src="https://opencollective.com/accounts-js/backers.svg?width=890" /></a>

### Sponsors

Thank you to all our sponsors! (please ask your company to also support this open source project by [becoming a sponsor](https://opencollective.com/accounts-js#sponsor))

<a href="https://opencollective.com/accounts-js/sponsor/0/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/0/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/1/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/1/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/2/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/2/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/3/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/3/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/4/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/4/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/5/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/5/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/6/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/6/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/7/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/7/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/8/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/8/avatar.svg" /></a>
<a href="https://opencollective.com/accounts-js/sponsor/9/website" target="_blank"><img src="https://opencollective.com/accounts-js/sponsor/9/avatar.svg" /></a>
