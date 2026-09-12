# Integration checks and local demo

`pnpm demo` runs a synthetic activation followed by scans 101, 101 (replay),
and 102. It prints honest mock receipts with no transaction hashes or verified
World identity. It requires no API keys or RPC and resets on each run.

`pnpm --filter @humanart/e2e-tests test` runs the cross-module lifecycle assertions.
Despite the historical filename, these are **in-memory integration tests**.
They do not launch a browser, communicate with a physical tag, call World, retrieve
IPFS assets or execute Solidity. EVM tests live in `packages/contracts/test`.

The complete real demo still requires World enrollment + wallet binding, artist
signatures, actual NFC authentication, authenticated chain reports, stored metadata
and a durable relayer. See [implementation status](../docs/implementation-status.md).
