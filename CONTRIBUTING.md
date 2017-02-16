# Contributing to Accounts

**TL;DR; Tests, coverage, linting, changelog** (See Pull Request Requirements, below).

The GraphQL Accounts project was intended - since it's inception - to be a community maintained project.  We'd love to see you get involved (especially long time contributors from the Meteor community who we've worked with before).

## Getting Started

1. Fork the project on Github (top right on the project page)
1. `git clone git@github.com:yourname/accounts`
1. `git checkout devel`
1. `git checkout -b proposed-feature`

Most packages in the project are self contained with their own tests.  But if you want to use your devel copy in a project, use `npm link`:

1. In your cloned directory: `sudo npm link`
1. In your app / project: `npm start` followed by `npm link @accounts/accounts`

## Pull Requests

### Requirements

For non-bug-fixes, please open an *issue* first and discuss your idea to make sure we're on the same page.  Alternatively, prepend your PR title with `[discuss]` to have a conversation around the code.

#### All PRs:

1. must not break the **test suite** (`npm test`), nor reduce **test coverage** (`npm run coverage`).  If you're fixing a bug, include a test that would fail without your fix.

1. must respect the **.eslintrc** (`npm run lint`).  Ideally your editor supports `eslint`.  Especially since the project is quite new, feel free to query default rules with us that don't make sense, or disable rules in a particular scope when it makes sense, together with a comment explaining why.

1. must update the **CHANGELOG.md** file, in the `Unreleased` section at the top, in the format of keepachangelog.com (**@mention** yourself at the end of the line).

1. must be **isolated**.  Avoid grouping many, unrelated changes in a single PR.

1. GitHub now allows auto-squashing of commits in a PR, so no need to rebase your commits before final submission.

### Submission

1. From [Getting Started](#getting-started), your work should ideally be in its own feature branch.
1. `git push`, and click on the new "merge" button / row on the project page.  *Merge to **devel***.

## Contributors with Commit Bit

* Should still submit a PR for changes (i.e. no work should be done on `devel` directly; all work should be done in it's own separate feature branch), which should be okayed by one other team member before merging.

* Should squash merged PRs whenever possible (via GitHub options).
