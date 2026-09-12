# Architecture status

## Canonical baseline

[`architecture.md`](./architecture.md) is the canonical technical baseline for HumanArt as of 2026-09-07. Implementation work must follow that document unless the team records a newer decision here.

## Decisions for the first prototype

- The NFC DNA 424 tag keeps its existing immutable AES-encrypted payload: tag identifier, monotonic counter, and integrity byte.
- HumanArt registers and allocates tags before an artist activates them. The artist does not program cryptographic material into the tag.
- A World-verified artist binds a wallet during enrollment and approves artwork metadata with that wallet. This binds the attribution record to the author while keeping the artist flow guided by the web application.
- The first viable tag-verification path uses a confidential execution environment to check the AES payload without exposing the shared secret. A Chainlink confidential workflow is the preferred candidate to evaluate for this component.
- Zero-knowledge and multi-party computation approaches remain valuable research options, but are not required for the first prototype.
- The MVP does not require a marketplace, payments, or a separate NFT per artwork. Its core job is durable physical-artwork authentication and author attribution.

## Imported supporting notes

The following documents preserve prior research and implementation planning. They may describe alternatives that are no longer selected for the MVP, notably ZK/MPC-only tag validation and an artist flow without a wallet signature:

- [`world-integration.md`](./world-integration.md)
- [`infrastructure-and-operations.md`](./infrastructure-and-operations.md)
- [`development-and-validation.md`](./development-and-validation.md)

Treat those documents as supporting material. Before implementation, reconcile any conflict in favor of [`architecture.md`](./architecture.md) and this status record.

## How to change this baseline

Record the decision, rationale, owner, and date in this file before changing protocol assumptions. Update the affected design document and tests in the same pull request.
