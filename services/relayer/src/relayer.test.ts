import { describe, expect, it } from "vitest";
import { createLocalDemo } from "./demo.js";
import { TagCryptogramVerifier } from "./tagVerifier.js";
import { RelayerJobQueue } from "./queue.js";
describe("mock relayer validation", () => {
  it("fails closed when no NFC provider exists", () => {
    expect(
      new TagCryptogramVerifier().verifyTagRead({ tagId: "HA-TEST", counter: "1" }).valid,
    ).toBe(false);
  });
  it("requires a context-bound ticket and matching metadata before activation", () => {
    const { relayer, activation, registry } = createLocalDemo();
    const missing = { ...activation };
    delete missing.authorizationTicket;
    expect(relayer.submitActivation(missing).error).toBe("MissingAuthorizationTicket");
    expect(
      relayer.submitActivation({
        ...activation,
        artist: { ...activation.artist, authorId: "other" },
      }).error,
    ).toBe("TicketContextMismatch");
    expect(
      relayer.submitActivation({
        ...activation,
        metadata: { ...activation.metadata, title: "forged" },
      }).error,
    ).toBe("MetadataDigestMismatch");
    expect(registry.isArtworkActivated(activation.tagId)).toBe(false);
    expect(relayer.submitActivation(activation).status).toBe("confirmed");
  });
  it("does not burn a ticket on invalid allocation and rejects altered tag reads", () => {
    const { relayer, activation, registry } = createLocalDemo();
    registry.allocateTag(activation.tagId, "other");
    expect(relayer.submitActivation(activation, "before-allocation").error).toBe(
      "TagAllocationMismatch",
    );
    registry.allocateTag(activation.tagId, activation.artist.authorId);
    expect(
      relayer.submitActivation({
        ...activation,
        activationRead: { ...activation.activationRead, cmac: "ffff" },
      }).error,
    ).toBe("TagMessageInvalid");
    expect(relayer.submitActivation(activation, "after-allocation").status).toBe("confirmed");
  });
  it("returns immutable historical receipts for an idempotent retry", () => {
    const { relayer, activation, reads } = createLocalDemo();
    relayer.submitActivation(activation);
    const first = relayer.submitScanVerification(reads[1]!, "scan1");
    relayer.submitScanVerification(reads[2]!, "scan2");
    const retry = relayer.submitScanVerification(reads[1]!, "scan1");
    expect(retry).toEqual(first);
    expect(retry.receipt.lastVerifiedCounter).toBe("101");
    expect(retry.receipt.isAuthentic).toBe(false);
    expect(retry.receipt.artist?.verificationLevel).toBe("mock");
    expect(retry.receipt.transactionHash).toBeUndefined();
    expect(retry.receipt.artwork).toEqual(activation.metadata);
    expect(() => relayer.submitScanVerification(reads[2]!, "scan1")).toThrow("IdempotencyConflict");
    expect(relayer.submitScanVerification(reads[1]!).receipt.status).toBe("counter_replay");
  });
  it("prevents external mutation and terminal job reprocessing", () => {
    const q = new RelayerJobQueue();
    const payload = { tagRead: { tagId: "HA-TEST", counter: "1" } };
    const j = q.enqueueJob("verify_scan", "key", payload);
    payload.tagRead.counter = "999";
    expect(q.getJob(j.id)?.payload).toEqual({ tagRead: { tagId: "HA-TEST", counter: "1" } });
    q.updateJobStatus(j.id, "processing");
    q.updateJobStatus(j.id, "failed");
    expect(() => q.updateJobStatus(j.id, "processing")).toThrow("InvalidJobTransition");
  });
});
