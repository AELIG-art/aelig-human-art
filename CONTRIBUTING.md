# Contributing

## Development discipline

- Make focused commits that explain one meaningful change.
- Keep documentation aligned with implementation. Mark proposed, simulated, and deployed components distinctly.
- Add or update tests with protocol changes.
- Use synthetic fixtures only. Never commit operational keys, personal data, scans from real tags, or provider credentials.
- Preserve the event's truthful Git history and disclose reused work and AI assistance accurately.

## Before opening a pull request or merging to main

Use Node.js 24 and the pnpm version pinned in `package.json`. Install the shared
pre-commit tooling once per checkout (Python 3.10 or later):

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
pnpm install --frozen-lockfile
pnpm hooks:install
```

The Git hook checks staged files on every commit. To check **all tracked files**
across every module, including documentation and repository configuration, run:

```sh
pnpm precommit
pnpm check
```

These use the same configuration as CI. Pre-commit checks file size (500 KiB),
JSON/YAML/TOML/XML syntax, conflict markers, private-key patterns, final newlines,
trailing whitespace, Prettier formatting and ESLint. Each check applies to its
supported file types; generated lockfiles are not reformatted by Prettier.
Private-key detection only recognizes known key patterns, not every kind of secret.
Prettier, newline and whitespace hooks can modify files: review and stage their
changes, then run the command again. They never stage changes automatically.
Untracked files enter the checks after `git add`; dependencies, build outputs and
local environments are excluded. `pnpm format` also formats supported working-tree
files before staging.

For protocol changes, add a concise threat-model note and negative tests. For user-facing work, include the relevant mobile-browser and World-handoff test evidence when available.
