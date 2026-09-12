Last updated: 2026-09-06. This is the execution plan for the agreed design, not a completed implementation checklist.

## First Technical Gate

The first milestone is a real NFC scan, a collaboratively generated proof, successful contract verification and rejection of the same consumed scan. Do this before investing heavily in the polished interface.

The project must not silently replace an unsuccessful distributed-proving experiment with a centralized full-key server. If the chosen chip and proof system cannot meet the constraints in time, document the measured limitation and ask the team to choose an explicitly different scope or trust model.

## Milestones

| Milestone                        | Work                                                                                                             | Acceptance evidence                                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| M0: documentation and repository | Create the agreed monorepo, preserve documentation provenance, choose licensing, add CI and public test fixtures | Reproducible checks, no secrets, clear planned versus implemented status                     |
| M1: protocol reference           | Freeze the NFC profile and independently validate captured test-tag authentication messages                      | Positive and negative vectors, parser/encoding specification                                 |
| M2: circuit feasibility          | Implement the complete authentication statement and key commitment checks                                        | Genuine circuit proof, modified-input rejection, memory/time measurements                    |
| M3: distributed proving          | Run witness and proof generation over shares with the selected MPC protocol                                      | Recorded topology, privacy/availability assumptions and full-key handling audit              |
| M4: chain registry               | Register a test tag, verify a proof and consume a counter atomically                                             | Transaction receipts, concurrency/replay tests and direct submission                         |
| M5: author authorization         | Integrate World, stable author linkage, activation entitlement and the confidential workflow experiment          | First-user/returning-user flows, altered-context rejection, authentic contract authorization |
| M6: product flow                 | Add Expo activation and visitor pages, IPFS upload and Railway jobs                                              | A physical tag can be activated and checked by another phone                                 |
| M7: operational evidence         | Exercise outages, retries, budgets and alternative verification                                                  | Logs, benchmarks, recovery notes and an honest limitations page                              |

World and Chainlink access requests can run alongside M1-M4. M5 should not block testing tag cryptography, but it must pass before claiming secure author-bound activation.

## Test Matrix

### NFC and Circuit Tests

- Known genuine message matches the independent reference implementation.
- Wrong key, altered MAC, changed UID, changed counter and changed covered URL bytes fail.
- Truncated, overlong, malformed-hex and unsupported-profile messages fail safely.
- Byte order, field lengths and maximum counter boundaries are explicit.
- The proof is bound to the registry's key commitment, not any attacker-selected key.
- All declared public inputs are constrained; changing the operation or metadata invalidates the corresponding authorization.
- The parser, native reference verifier and circuit agree on every public fixture.
- Capture limits are tested: an unused copied URL may still represent a valid bearer message; the test report must say so.

### MPC Tests

- Each operator receives only the shares required by the selected protocol.
- Witness generation and proof generation both execute through the collaborative path.
- No hidden coordinator reconstructs the complete witness.
- Malformed shares, protocol failures and operator disconnects fail according to documented assumptions.
- Logs, temporary files, crash dumps, backups and build artifacts contain no operational key material.
- Benchmark real circuit size, prover memory, elapsed time, traffic and verification gas.

### Contract Tests

- Reject unknown tags, unsupported versions, invalid proofs and duplicate registration.
- Accept a valid higher counter and reject equal/lower counters; allow skipped values.
- Reject duplicate activation, wrong author binding, altered metadata, expired authorization and invalid delivery entitlement.
- Consume activation authorization and tag counter atomically; never leave half-activated records.
- Exercise concurrent 42/44 scans and concurrent activation attempts.
- A copied transaction cannot redirect authorship or metadata; relayer address is not the owner by default.
- Independent direct proof submission works under the same contract rules.
- Test chain/domain separation and the selected finality/reorganization policy.
- Administrative roles cannot silently bypass authentication or reassign artwork without the documented policy.

### World and Workflow Tests

- First-time artist, returning artist, app cancellation, denied camera and expired request.
- Exact app, action, credential, environment and signal/context verification.
- Stable author identity across multiple artwork activations.
- Explicit credential linking; no automatic merging by display name.
- Sandbox credentials never qualify as production identity evidence.
- RP secret remains outside browser bundles and ordinary public workflow inputs.
- Chainlink result validation checks the correct workflow and forwarder where applicable.
- Mock, CLI simulation and live confidential execution have different visible labels.

### Web and Operations Tests

- Real NFC URL opens HumanArt on the team's iOS and Android devices.
- Draft survives World app switching, refresh and cancellation.
- Visitor does not need World, a wallet or cryptocurrency.
- Pending, stale, invalid and unavailable states are distinct and understandable.
- Historical certificate view is not labelled a fresh scan.
- Worker restart/retry does not duplicate jobs, gas spending or activation.
- Failed IPFS upload does not finalize an incomplete certificate.
- RPC outage, storage outage, relayer depletion and prover outage have recoverable UI paths.
- A physical label moved to another object is not magically detected by ordinary DNA 424; the demo states the limit.

## API and Interface Work

Before building parallel modules, agree on versioned schemas for a scan envelope, activation intent, author evidence, proof job, transaction receipt and public certificate view. Include explicit environment identifiers and a shared error vocabulary.

Do not invent final endpoint names, command-line instructions or contract addresses in documentation before they exist. Once implemented, add example requests using disposable test fixtures and record actual commands in each module README.

Recommended job states are queued, processing, awaiting proof, awaiting authorization, submitted, confirmed, failed and expired. These are an initial design vocabulary; transition rules and idempotency must be implemented deliberately.

## Open Decisions

| Question                                                                    | Required evidence before closing it                                                   |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Can the full DNA 424 statement be proved within acceptable time and memory? | Real captured-message circuit benchmark, not a toy proof                              |
| Which ZK backend and commitment scheme?                                     | Security review, prover/verifier compatibility and setup documentation                |
| Which MPC protocol and operator topology?                                   | Explicit collusion, malicious-input and availability assumptions                      |
| How is activation entitlement delivered?                                    | A flow that prevents opportunistic tag claiming without adding confusing artist steps |
| How is author continuity represented across World versions?                 | Tested identifier scope and account-linking policy                                    |
| How does World evidence authorize the contract?                             | A tested native-verifier or authenticated-attestation path                            |
| Can sensitive World processing run in CRE?                                  | Working runtime, confidentiality-boundary and real-access evidence                    |
| Which chain for the final deployment?                                       | End-to-end compatibility, gas measurement and applicable deployment requirements      |
| Can certificates be edited, retired or replaced?                            | Explicit author/issuer powers and preservation of historical records                  |
| How are lost accounts and damaged tags recovered?                           | Recovery policy that does not create an undocumented central authorship override      |
| Who funds verification over time?                                           | Measured costs, budget limits and available operators                                 |
| What license applies to code and media?                                     | Team decision and third-party compatibility check                                     |

## Decision History

- The product name is HumanArt; project documentation is organized under Human-Art.
- The approved future repository name is `aelig-human-art`.
- The MVP moved from a generic physical-asset/NFT concept to artist activation of prepared NFC certificates.
- The artist does not need an extra NFT minting step or a manual wallet-signature ceremony.
- World Selfie Check is sufficient as product policy, with optional stronger or different credentials.
- A centralized tag-key verifier is rejected. ZK alone is not a key-custody solution; ZK plus MPC is the proposed research direction.
- The Graph is not responsible for counter correctness and is not required for the MVP.
- ENS naming adds unnecessary lifecycle and permission complexity for the base artist flow.
- Payment, swap and agent integrations are not added solely to increase partner coverage.
- Expo is the agreed frontend; Railway hosts support services, not a magical fully decentralized backend.

Event-specific sponsor assessments and eligibility history remain in the separate [ETHOnline dossier](https://docs.aelig.art/doc/ethonline-2026-event-rules-and-partner-dossier-EVwaRTPdg9).

## Documentation and Delivery Discipline

Preserve real development history. Do not backdate commits or present earlier planning as newly authored implementation. This documentation was consolidated on 2026-09-06 from earlier team discussions and public research. Record that provenance when importing it into GitHub.

For each implemented feature, replace speculative language with evidence only after tests pass. Record the exact tested commit and environment. Publish useful public fixtures, not operational scan histories or personal credentials.

Use CI for formatting, types, module tests and feasible contract/circuit checks. Hardware and expensive distributed tests may run separately, but their procedure and results must remain reproducible. Record AI assistance and the team's design, review, implementation and validation contributions accurately.

## Definition of a Credible Prototype

A second person can receive a prepared tag, activate it as a World-checked artist and verify it from another phone. The blockchain enforces replay rejection. The team can show how keys are shared, what the circuit proves, which services remain trusted and what was simulated. Repository code and evidence match the claimed deployment.

Until that demonstration exists, the system is an architecture under implementation, not a production-ready authenticity service.
