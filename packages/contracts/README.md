# Registry prototype

Two separate implementations:

- `src/HumanArtRegistry.sol`: experimental Solidity registry, restricted to issuers/operators.
- `src/index.ts`: in-memory simulation for service tests, not an EVM or ABI binding.

The issuer registers and allocates tags. The operator can activate the allocated
author and advance counters. Public callers cannot claim tags or jump counters.
**Operators remain trusted:** no authenticated NFC report, World enrollment or
artist wallet signature is checked on-chain yet. Do not deploy this as an
authenticity verifier. The stored tag commitment is not used to verify a proof.

With Foundry 1.3.1 on PATH:

```sh
pnpm --filter @humanart/contracts build
pnpm --filter @humanart/contracts test:sol
```

Solidity compiler: 0.8.28. Tests include unauthorized activation/counter updates,
allocation, replay, batch rollback, ownership transfer and counter fuzzing.
`pnpm --filter @humanart/contracts test` tests only the TypeScript model.
