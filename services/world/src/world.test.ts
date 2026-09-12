import { afterEach, describe, expect, it, vi } from "vitest";
import {
  WorldIdVerifierService,
  MockWorldIdVerifierService,
  computeActivationSignal,
  createRpRequest,
} from "./index.js";
const tagId = "HA-TEST",
  metadataDigest = "0xdigest";
function proof() {
  return {
    merkle_root: "mock",
    nullifier_hash: "synthetic-person",
    proof: "humanart-local-fixture",
    verification_level: "mock",
    signal: computeActivationSignal(tagId, metadataDigest),
    action: "mock-activate-artwork",
  };
}
afterEach(() => vi.useRealTimers());
describe("mock World boundary", () => {
  it("fails closed without a provider", () => {
    expect(new WorldIdVerifierService().verifyProof(tagId, metadataDigest, proof()).valid).toBe(
      false,
    );
    expect(() => createRpRequest()).toThrow("WorldIntegrationUnavailable");
  });
  it("never upgrades a fixture to Orb evidence or exposes its nullifier", () => {
    const service = new MockWorldIdVerifierService();
    expect(
      service.verifyProof(tagId, metadataDigest, { ...proof(), verification_level: "orb" }).valid,
    ).toBe(false);
    const result = service.verifyProof(tagId, metadataDigest, proof());
    expect(result.artist?.verificationLevel).toBe("mock");
    expect(result.artist).not.toHaveProperty("worldNullifierHash");
    expect(service.verifyProof(tagId, metadataDigest, proof()).valid).toBe(false);
  });
  it("requires scope and signal and binds one-use tickets to their context", () => {
    const service = new MockWorldIdVerifierService();
    expect(
      service.verifyProof(tagId, metadataDigest, { ...proof(), signal: undefined }).valid,
    ).toBe(false);
    const result = service.verifyProof(tagId, metadataDigest, proof());
    const context = { tagId, metadataDigest, authorId: result.artist!.authorId };
    expect(() =>
      service.validateTicket(result.authorizationTicket!, { ...context, tagId: "OTHER" }),
    ).toThrow("TicketContextMismatch");
    service.consumeTicket(result.authorizationTicket!, context);
    expect(() => service.validateTicket(result.authorizationTicket!, context)).toThrow(
      "TicketAlreadyConsumed",
    );
  });
  it("rejects expired tickets at the deadline", () => {
    vi.useFakeTimers();
    const service = new MockWorldIdVerifierService();
    const result = service.verifyProof(tagId, metadataDigest, proof());
    vi.advanceTimersByTime(600_000);
    expect(() =>
      service.validateTicket(result.authorizationTicket!, {
        tagId,
        metadataDigest,
        authorId: result.artist!.authorId,
      }),
    ).toThrow("TicketExpired");
  });
});
