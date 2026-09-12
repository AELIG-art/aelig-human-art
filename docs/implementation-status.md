# Implementation status and review

Reviewed 2026-09-12 against the other agent's uncommitted implementation.
This file describes what exists. [Architecture](architecture.md) describes the target.
No remote deployment or live partner verification was performed during this review.

## Readiness

| Component       | Implemented and locally tested                                                                | Missing for a real demo                                                                              |
| --------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Shared protocol | Synthetic URL parsing, canonical metadata, Keccak-256, negative vectors                       | Confirmed hardware profile, actual encrypted-tag vectors, versioned final schemas                    |
| Expo            | Artist/collector screens, shared URL parsing, local draft preview                             | Service API connection, durable drafts, World handoff, wallet, metadata upload                       |
| Solidity        | Issuer/operator access, tag allocation, activation, monotonic counter, tests on EVM           | Authenticated tag reports, World enrollment, artist signatures, request binding, immutable revisions |
| World           | Disabled real adapter and explicitly opt-in mock; context-bound expiring one-use mock tickets | Sandbox credentials, enabled credential policy, supported SDK, wallet binding, real verification     |
| Relayer         | In-memory queue, context validation, fixture checks, immutable idempotent receipts            | HTTP API, database, jobs after restart, RPC, transaction signing, gas budgets                        |
| Chainlink       | Design boundary only                                                                          | Access validation, confidential key custody, runtime implementation, authenticated chain reports     |
| Storage         | Metadata digest validation in memory                                                          | Upload, pinned content, retrieval and asset-byte verification                                        |
| Issuer/hardware | Synthetic registration fixtures                                                               | Real tag configuration, custody, registration and allocation tooling                                 |

**A local simulation can be demonstrated now. A real end-to-end artwork demo cannot.**
The UI and service simulation are separate. The Solidity tests are separate EVM tests.
The integration test filename does not imply hardware, browser or blockchain execution.

## Findings corrected

1. Unrestricted Solidity activation and counter updates could claim another tag or
   advance it arbitrarily. Both now require an operator, and activation must match
   the issuer's tag allocation. This is still a trusted-operator prototype.
2. The World service accepted arbitrary proof fields, made signal checking optional,
   claimed Orb status and emitted a pseudo-signature with a development secret.
   Real verification now fails closed. Mock identities are always marked mock,
   omit raw nullifiers and cannot silently become World evidence.
3. The tag verifier accepted a formatted public counter without cryptographic proof.
   The default now rejects all reads; the mock matches an injected complete fixture.
4. Activation accepted missing tickets and did not compare ticket context or metadata.
   It now requires tag/digest/author binding, allocation, matching metadata and an
   accepted mock activation read before any state mutation.
5. Job retries could return different receipt content, reuse a key for different data,
   and expose mutable nested queue state. Jobs and receipts are cloned, keys bind
   the full payload, and terminal results are preserved.
6. Collector receipts invented artwork details, Orb verification and transaction
   hashes. They now return saved mock data, distinct statuses, no transaction hash
   and `isAuthentic: false`.
7. Custom Keccak and permissive JSON conversion were replaced by versioned libraries
   and strict input checks. Counter bounds, duplicate query parameters, odd-length
   hex and misleading hardware aliases are rejected.
8. Solidity scripts swallowed failures with `|| true`. Failures now propagate;
   CI runs actual EVM tests and the Expo export.
9. Metro could not resolve shared source imports ending in `.js`. Imports now
   resolve against the shared TypeScript source.
10. UI identity labels now say mock rather than Sandbox; changing draft inputs clears
    the prepared state. Manual form input uses the same parser as deep links.

## Validation evidence

- TypeScript checks and 44 tests across all six workspaces.
- Seven Foundry EVM tests, including fuzzing, with Solc 0.8.28 / Foundry 1.3.1.
- Expo production web export.
- Browser smoke checks for the local artist flow and collector deep link.
- Full-repository pre-commit checks.
- `pnpm demo`: activation, counter 101 accepted in the simulation, replay rejected,
  then counter 102 accepted. No external systems involved.

No physical NFC device, iOS/Android native build, real World proof, Chainlink
workflow, storage provider, persistent relayer or deployed chain was tested.
The Metro build may report a non-blocking fallback for noble-hashes' crypto export.

## Next demo gates

1. Confirm the tag's real encrypted payload/authentication profile and test vectors;
   establish actual Chainlink access and key-custody/reporting guarantees.
2. Implement an authenticated tag-report/request lifecycle on-chain. Operator
   permission alone must not be marketed as decentralized authentication.
3. Add World enrollment with stable scope, wallet binding and replay-safe authorization.
4. Add signed metadata publication, single-use enrollment reads and immutable revisions.
5. Add persistent storage, HTTP adapters and relayer transaction recovery/budgets.
6. Connect Expo and test from a second phone, with artist offline; demonstrate altered
   messages, duplicate scans, wrong artists and changed metadata being rejected.

Mock operation is a testing aid, not an approved replacement for the chosen
confidential/decentralized trust model.
