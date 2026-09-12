# Shared protocol

Browser-compatible types, strict JSON metadata canonicalization and Ethereum Keccak-256.
Hashing uses `@noble/hashes`; serialization uses `canonicalize` with explicit rejection
of invalid Unicode, non-finite numbers, undefined values, non-JSON objects and cycles.

The NFC parser handles **HumanArt synthetic envelopes** only:
`https://host/?tag=HA-TEST&counter=101&enc=0102&cmac=aabb`.
It rejects duplicates, unknown aliases and malformed hex. Counters remain decimal
strings, bounded to uint256 for the registry prototype. The physical chip's bound
and encrypted protocol still require confirmed hardware vectors.

`pnpm --filter @humanart/shared test`

Fixtures are synthetic. Parsing a URL does not validate AES, CMAC or physical presence.
