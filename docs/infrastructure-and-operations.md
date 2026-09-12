Last updated: 2026-09-06. Railway and GitHub are agreed platforms. The remaining providers are proposed defaults; this document does not assert that accounts, access flags, servers or wallets have been provisioned.

## Deployment Inventory

| Component                      | Planned location                                             | State and secrets                                                                |
| ------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Expo web build                 | Railway `web` service                                        | Public configuration only                                                        |
| HTTP API and World adapter     | Railway `api` service                                        | Short-lived sessions, provider credentials as necessary; no tag keys             |
| Jobs and transaction relay     | Railway `worker` service                                     | Gas-funded relayer credential, bounded job queue                                 |
| Operational database           | Railway PostgreSQL                                           | Drafts, sessions, job records, receipts; no authoritative authentication counter |
| Registry and proof verifier    | Selected EVM chain                                           | Public certificates, commitments and counter state                               |
| Confidential identity workflow | Chainlink CRE, subject to beta access                        | Sensitive application credential handling; not a Railway-hosted TEE              |
| Proving operators              | Initially local; later independently administered hosts      | Distinct persistent key shares and authenticated peer connections                |
| Artwork media and metadata     | Public IPFS through Pinata plus an independent retained copy | Public content and content identifiers                                           |
| Issuer tooling                 | Controlled local workstation and NFC hardware                | Transient provisioning secrets and operator-share distribution                   |
| Source and automation          | One public GitHub repository                                 | Code, tests and public fixtures; no operational secrets                          |

## Railway Project

Use a single Railway project with separate `web`, `api`, `worker` and PostgreSQL services. Shared source remains in the same GitHub repository. Build from the repository root when a module imports shared packages; configure service-specific commands and watch paths including shared dependencies. Railway supports shared monorepos and separate build/start configuration. [Railway monorepo documentation](https://docs.railway.com/deployments/monorepo)

Expo can generate a static web build. Serve that build with correct route handling, HTTPS and cache rules; server-side rendering does not require us to switch to Next.js. Native packaging later still needs platform-specific integration testing. [Expo static rendering](https://docs.expo.dev/router/web/static-rendering/)

Use PostgreSQL for recoverable job and draft state. Start with a database-backed job mechanism instead of introducing Redis solely because background work exists. Define migrations, unique operation identifiers, job leases, retries and receipts. Railway provides PostgreSQL deployment support; backups and recovery must be configured and tested, not assumed. [Railway PostgreSQL](https://docs.railway.com/databases/postgresql)

Do not copy the authoritative counter into Postgres and use that copy to approve scans. Any cached certificate view must retain its block reference and freshness status.

## Accounts and Access Checklist

| Access                 | What must be available before its integration is considered ready                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| GitHub                 | Public `aelig-human-art` repository, appropriate team access, branch policy and CI                 |
| Railway                | Shared project, deployment access, service secrets and spending controls                           |
| World                  | HumanArt app ID, RP configuration, Selfie Check feature flag and sandbox access on team devices    |
| World optional preview | Explicit Identity Check enablement if we implement it                                              |
| Chainlink              | CRE account and CLI access; separate live deployment/confidential-workflow permissions as required |
| Alchemy                | An RPC application for the selected development chain                                              |
| Pinata                 | Public IPFS upload credentials with restricted scope, plus retrieval configuration                 |
| Domain                 | A stable domain controlled by the team before non-disposable tags are personalized                 |

Use environment variables or provider-managed secret storage with least privilege. Do not paste credentials into chat, documentation or public CI logs. Account access must be verified through each provider; a team member's personal World credential is not an application integration permission.

## Chain and Wallets

Start protocol development locally, then use Ethereum Sepolia for integration experiments. Sepolia is a testnet, not the final production network. Alchemy is the proposed RPC provider; RPC means Remote Procedure Call, the interface used to read chain state and broadcast signed transactions. The provider must remain replaceable. [Alchemy network configuration](https://www.alchemy.com/docs/choosing-a-web3-network)

Do not select the final mainnet until the proof verifier, World authorization path, actual CRE write support and gas measurements are tested together. World ID integration alone does not determine the deployment chain. Record chain ID, explorer, contract addresses, verifier/circuit version and supported protocol profile in a deployment manifest.

Separate operational roles:

- Deployer: creates contracts; authority after deployment must be explicitly documented.
- Issuer: registers prepared tags. This may share a development wallet initially, but remains a distinct permission.
- Relayer: holds limited funds and pays for eligible user operations; must not gain issuer or author privileges.

Use dedicated development wallets and never reuse a personal main wallet. Keep production-like funding small, monitor balances and enforce an application gas budget. Domain separation and one-time operation identifiers prevent a relay job from becoming an unrestricted transaction-signing service.

## Proof-Operator Hosting

Begin with local processes and test-only secrets to measure CPU, memory, proof time and networking requirements. Do not buy a fixed server size before the real NFC circuit has run.

A production-like topology needs separately administered operators, authenticated encrypted links, persistent secret shares and a documented backup/recovery policy. Three containers under one Railway administrator do not establish the required independent-custody guarantee. Hosting all shares under one cloud provider also leaves a shared infrastructure trust boundary even when accounts differ.

Choose the protocol before promising fault tolerance. Persistent key sharing, collusion assumptions and operator liveness must match the actual implementation. The open-source coCircom research path is distinct from assuming a hosted TACEO API provides independent long-lived custody. [co-snarks](https://github.com/TaceoLabs/co-snarks)

## Artwork Storage and Availability

Use Pinata's public-IPFS upload path for artwork photographs and canonical metadata. Keep upload credentials server-side or use appropriately scoped short-lived upload authorization. Store content identifiers, not provider-specific gateway URLs, as the durable references. [Pinata quick start](https://docs.pinata.cloud/quickstart)

Maintain a second independent copy of both media and metadata and verify retrieval from more than one gateway or node. A content identifier proves content addressing, not permanent availability; pinning and ongoing hosting remain necessary. [IPFS persistence](https://docs.ipfs.tech/how-to/pin-files/)

Railway may hold temporary drafts, but its filesystem or object storage must not be the only copy of an activated artwork's public certificate metadata. Do not upload selfies or identity documents to public IPFS.

Domain control matters because tags contain a URL. A stable team-controlled name lets the web hosting move. It does not make DNS or the web interface decentralized. Publish enough protocol information and an alternative-client path that verification is not cryptographically dependent on that one domain.

## Environment and Secret Classes

Proposed configuration categories, not existing variable names:

| Category                  | Public or private  | Examples                                                                 |
| ------------------------- | ------------------ | ------------------------------------------------------------------------ |
| Application configuration | Public             | Chain ID, registry address, protocol version, World app ID               |
| Provider access           | Private/restricted | RPC service keys, IPFS upload credentials, database URL                  |
| Transaction funding       | Private            | Relayer signing credential                                               |
| World request signing     | Private            | RP signing material, ideally protected by the selected confidential path |
| Tag authentication        | Secret-shared      | Operator shares; never ordinary Railway API environment variables        |
| Issuance                  | Highly sensitive   | Transient personalization material; never committed fixtures             |

Keep sandbox and production credentials, author records, contracts and proof acceptance policies separate. A configuration flag must not accidentally make test World proofs acceptable in the production registry.

## Costs and Monitoring

The prototype's operating budget covers Railway compute/database, proof-generation compute, blockchain gas, RPC usage, content hosting and any CRE service charges. No numeric estimate is confirmed; benchmark the real circuit and check provider quotas before budgeting.

Artists and visitors do not pay through the base UI. HumanArt sponsors the relayer and proving costs. Later tag pricing could include a verification allowance, but that is a business proposal, not implemented billing.

Track job duration, proving failures, transaction inclusion/finality, gas per accepted scan, relayer balance, operator availability and metadata retrieval. Redact full scan URLs, credential payloads and secrets from logs. Add request limits and bounded queues so public verification cannot exhaust unlimited gas or proof compute.

## Operational Completion Criteria

- Restart a worker without losing or duplicating an activation.
- Recover the database and reconcile it with chain receipts.
- Switch RPC providers without changing certificate identity.
- Retrieve artwork metadata when the primary gateway is down.
- Verify an existing proof without the Railway API.
- Document what stops when a proving operator is unavailable.
- Restore an operator safely without combining all secret shares in a shared backup.
- Separate health checks from authenticated user operations.

These checks are planned; none is claimed to have passed yet.
