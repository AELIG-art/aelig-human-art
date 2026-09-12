# Mock relayer

`MockHumanArtRelayerService` is a synchronous, memory-only coordinator.
It validates mock tickets, tag allocation, metadata digests and exact injected
tag fixtures before changing the local registry. It does not use RPC, pay gas,
provide an HTTP API, persist jobs or execute background retries.

`TagCryptogramVerifier` fails closed. `MockTagCryptogramVerifier` accepts only
explicit synthetic fixtures; changing the counter or message is rejected unless
the complete fixture is registered. This is not AES/CMAC validation.

Repeated idempotency keys must have identical type and payload. They return the
original job and receipt snapshot. Failed jobs are terminal; corrected requests
need a new key. Returned data is cloned to prevent callers mutating queue state.
Receipts always contain `mode: mock`, `isAuthentic: false` and no transaction hash.

`pnpm --filter @humanart/relayer-service test`

`src/demo.ts` supplies an explicit test fixture for the local demo.
Production requires durable storage, authenticated report delivery, wallet/nonce
handling, chain receipts, budget enforcement and recovery after process failure.
