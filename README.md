# HumanArt

HumanArt is a prototype for associating physical artwork with immutable AES NFC tags, artist-approved metadata, and World ID-backed artist attribution. A collector can scan a registered tag and retrieve an on-chain-backed verification result without trusting a mutable application database as the authority for tag state.

This repository is the public implementation workspace for ETHOnline 2026. It includes an Expo web prototype for the artist and collector journeys. It does **not** yet contain deployed contracts, NFC key material, a working AES verifier, an operational World integration, or a production service.

## Repository layout

```text
apps/web/                 Browser experience for artists and collectors
packages/contracts/       On-chain registry and verifier contracts
packages/circuits/        Zero-knowledge circuits and public fixtures
packages/shared/          Versioned schemas and shared protocol primitives
services/prover/          Distributed-proof orchestration experiments
services/world/           World ID request, verification, and authorization bridge
services/relayer/         Idempotent transaction-submission service
services/chainlink/       Chainlink CRE confidential-workflow integration
tools/issuer/             Internal NFC tag registration and issuance tooling
tests/                     Cross-module and end-to-end tests
docs/                      Architecture, operations, validation, and hackathon material
```

Read [the architecture](docs/architecture.md) before changing protocol code. It separates tag authentication, artist identity evidence, metadata approval, and public verification into distinct claims. [Architecture status](docs/ARCHITECTURE-STATUS.md) identifies the selected MVP baseline where imported research notes differ. The [development and validation plan](docs/development-and-validation.md) defines the first technical milestone and the test requirements.

## Local checks

Use Node.js 22 or later and pnpm 10 or later.

```sh
pnpm check
```

This validates documentation, linting, and TypeScript types. To run the web prototype locally:

```sh
pnpm --filter @humanart/web web
```

The interface has intentionally explicit local/sandbox labels until each cryptographic and provider-backed integration exists.

## Security and transparency

- Never commit AES keys, World credentials, wallet private keys, tag messages, personal data, or biometric material.
- Keep synthetic cryptographic fixtures separate from operational material.
- Do not describe a mock, local simulation, or centralized adapter as a deployed decentralized verifier.
- Record implementation provenance and AI assistance in [AI attribution](docs/AI-ATTRIBUTION.md).

The project is intentionally not licensed yet. Add a license after the team confirms the intended open-source terms and third-party compatibility.
