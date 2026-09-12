import { randomUUID } from "node:crypto";
import { computeActivationSignal } from "./signal.js";

export function createMockRpRequest(options: { tagId: string; metadataDigest: string }) {
  return {
    environment: "mock" as const,
    action: "mock-activate-artwork",
    signal: computeActivationSignal(options.tagId, options.metadataDigest),
    nonce: randomUUID(),
    expiresAt: Date.now() + 10 * 60_000,
  };
}
// Real RP requests must be implemented against the enabled World SDK version.
export function createRpRequest(): never {
  throw new Error("WorldIntegrationUnavailable");
}
