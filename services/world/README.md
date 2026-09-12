# World boundary

Real World Sandbox access and an SDK integration are pending.
`WorldIdVerifierService` defaults to disabled; `createRpRequest` throws
`WorldIntegrationUnavailable`. Neither accepts real credentials today.

`MockWorldIdVerifierService` and `createMockRpRequest` are explicit local test helpers.
They require synthetic proof markers and exact context. Returned identities are always
`mock`, never Orb/Selfie evidence, and omit the raw nullifier.
Opaque activation tickets are held in memory, expire and bind tag/digest/author.
They are not World proofs or on-chain signatures. Restart loses all ticket state.
Mock construction is refused when `NODE_ENV=production`.

`pnpm --filter @humanart/world-service test`

The real integration must implement fixed enrollment scope, wallet ownership/context,
credential policy, freshness, nonce replay protection and an authenticated on-chain
authorization route. The mock activation signal does not define the future World API.
