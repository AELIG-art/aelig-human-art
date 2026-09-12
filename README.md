# HumanArt

Physical-artwork attribution using NFC tags, artist-approved metadata and World ID.
Current build: Expo UI, an in-memory lifecycle demo and an experimental Solidity
registry. Real World/NFC/Chainlink verification is not connected.

## Try locally

Node.js 24 and pnpm 10.17.0 (via Corepack) are required.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev     # Expo web UI; open the URL printed by Expo
```

Select **Activate a tag**, **Try identity mock**, then enter artwork details and
prepare a local draft. **Verify** shows the synthetic scan interface.
The UI is not connected to the service simulation; drafts reset on refresh.

```sh
pnpm demo      # Separate in-memory activation -> scan -> replay rejection
pnpm check     # Documentation, lint, types and all TypeScript tests
pnpm precommit # All tracked files; requires pre-commit setup below
pnpm check:sol # EVM tests; requires Foundry 1.3.1 on PATH
```

No API keys, RPC, wallet funds or real tags are needed for the local simulation.

[Setup and hooks](CONTRIBUTING.md) |
[Architecture status](docs/ARCHITECTURE-STATUS.md) |
[Architecture](docs/architecture.md) |
[Development plan](docs/development-and-validation.md) |
[AI attribution](docs/AI-ATTRIBUTION.md)

Never commit operational keys or real scan/identity data. License selection is pending.
