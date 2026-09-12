# Development and validation

Current evidence is in [implementation status](implementation-status.md).
The governing protocol remains [architecture](architecture.md).
Earlier ZK/MPC-only milestones are historical alternatives, not current MVP prerequisites.

## Development sequence

1. Consolidate real NFC protocol vectors and confidential-provider feasibility.
2. Implement authenticated request/report finalization with on-chain counter consumption.
3. Implement World enrollment, wallet binding and explicit artist consent.
4. Implement metadata storage, digest verification, wallet signatures and immutable publication.
5. Implement durable relayer jobs, gas budgets, HTTP APIs and recovery after restart.
6. Connect Expo; preserve drafts through refresh, cancellation and identity handoff.
7. Demonstrate from two phones and record chain/provider evidence.

World Sandbox access can proceed in parallel with NFC and registry work.
Never guess hardware AES parameters or treat a public counter as authenticated.
The current operator-gated registry and local simulations do not complete steps 1-5.

## Checks

```sh
pnpm precommit
pnpm check
pnpm --filter @humanart/web export:web
pnpm check:sol
pnpm demo
```

Pre-commit setup: [contributing](../CONTRIBUTING.md).
EVM tests require Foundry 1.3.1; the compiler is pinned in the contracts package.
CI runs pre-commit, all TypeScript checks/tests, web export and EVM tests.

## Required real-demo scenarios

- Registered tag and correct authenticated message accepted once; replay rejected.
- Wrong key, payload, request, chain, contract or report source rejected.
- Counter never decreases across concurrent finalization or metadata updates.
- Artist proof bound to wallet A cannot authorize wallet B.
- No allocation means no tag claim, even with valid World identity.
- Ticket/read authorization consumed exactly once without double-consuming a counter.
- Changed metadata/assets fail integrity checks.
- Retry preserves the original receipt and does not spend gas twice.
- Artist can be offline during collector verification.
- Missing metadata, stale history and unavailable provider have different UX states.

Passing the local simulation tests is not evidence that these external integration
properties have been implemented.
