import { randomUUID } from "node:crypto";
import {
  canonicalizeJson,
  computeArtworkDigest,
  keccak256,
  type ActivationPayload,
  type TagRead,
  type VerificationReceipt,
} from "@humanart/shared";
import { SimulatedHumanArtRegistry } from "@humanart/contracts";
import { WorldIdVerifierService } from "@humanart/world-service";
import { RelayerJobQueue } from "./queue.js";
import { TagCryptogramVerifier } from "./tagVerifier.js";
import type { ActivationJobPayload, RelayJob, ScanJobPayload } from "./types.js";

// Explicit simulation: does not send transactions, pay gas or attest physical artwork.
export class MockHumanArtRelayerService {
  private queue = new RelayerJobQueue();
  private metadata = new Map<string, ActivationPayload>();
  private receipts = new Map<string, VerificationReceipt>();
  constructor(
    private registry: SimulatedHumanArtRegistry,
    private world: WorldIdVerifierService,
    private tags: TagCryptogramVerifier,
  ) {
    if (process.env.NODE_ENV === "production") throw new Error("MockDisabledInProduction");
    if (world.mode !== "mock") throw new Error("MockWorldRequired");
  }
  getJob(id: string) {
    return this.queue.getJob(id);
  }
  submitActivation(activation: ActivationPayload, key?: string): RelayJob {
    const job = this.queue.enqueueJob(
      "activate_artwork",
      key ?? "act_" + keccak256(canonicalizeJson(activation)),
      { activation },
    );
    return this.processJob(job.id);
  }
  submitScanVerification(
    tagRead: TagRead,
    key?: string,
  ): { job: RelayJob; receipt: VerificationReceipt } {
    const job = this.queue.enqueueJob("verify_scan", key ?? randomUUID(), { tagRead });
    const processed = this.processJob(job.id);
    const existing = this.receipts.get(job.id);
    if (existing) return { job: processed, receipt: structuredClone(existing) };
    const accepted = processed.status === "confirmed";
    const saved = this.metadata.get(tagRead.tagId);
    const record = this.registry.isArtworkActivated(tagRead.tagId)
      ? this.registry.getArtwork(tagRead.tagId)
      : undefined;
    const receipt: VerificationReceipt = {
      mode: "mock",
      tagId: tagRead.tagId,
      counter: tagRead.counter,
      isAuthentic: false,
      tagStatus: accepted ? "simulated" : "rejected",
      identityStatus: saved ? "mock" : "unavailable",
      metadataStatus: saved ? "matched" : "unavailable",
      status: accepted
        ? "simulated"
        : processed.error === "CounterNotMonotonic"
          ? "counter_replay"
          : !this.registry.isTagRegistered(tagRead.tagId)
            ? "unregistered_tag"
            : processed.error?.startsWith("TagMessageInvalid")
              ? "invalid_message"
              : "error",
      ...(processed.error ? { reason: processed.error } : {}),
      ...(saved
        ? {
            artwork: structuredClone(saved.metadata),
            artist: structuredClone(saved.artist),
            metadataUri: saved.metadataUri,
          }
        : {}),
      ...(record ? { lastVerifiedCounter: record.lastCounter.toString() } : {}),
      verifiedAt: new Date().toISOString(),
    };
    this.receipts.set(job.id, structuredClone(receipt));
    return { job: processed, receipt };
  }
  processJob(id: string): RelayJob {
    const job = this.queue.getJob(id);
    if (!job) throw new Error("JobNotFound");
    if (job.status !== "pending") return job;
    this.queue.updateJobStatus(id, "processing");
    try {
      if (job.type === "activate_artwork") {
        const a = (job.payload as ActivationJobPayload).activation;
        if (!a.authorizationTicket) throw new Error("MissingAuthorizationTicket");
        if (a.artist.verificationLevel !== "mock" || a.artist.worldNullifierHash)
          throw new Error("MockIdentityRequired");
        if (computeArtworkDigest(a.metadata) !== a.metadataDigest)
          throw new Error("MetadataDigestMismatch");
        const expected = {
          tagId: a.tagId,
          metadataDigest: a.metadataDigest,
          authorId: a.artist.authorId,
        };
        this.world.validateTicket(a.authorizationTicket, expected);
        if (a.activationRead.tagId !== a.tagId || a.activationRead.counter !== a.initialCounter)
          throw new Error("ActivationReadMismatch");
        const check = this.tags.verifyTagRead(a.activationRead);
        if (!check.valid || check.mode !== "mock") throw new Error("TagMessageInvalid");
        this.registry.validateActivation(
          a.tagId,
          a.metadataUri,
          a.metadataDigest,
          a.artist.authorId,
          a.initialCounter,
        );
        // All validation completes before mutation; this is synchronous and memory-only.
        this.world.consumeTicket(a.authorizationTicket, expected);
        this.registry.activateArtwork(
          a.tagId,
          a.metadataUri,
          a.metadataDigest,
          a.artist.authorId,
          a.initialCounter,
        );
        this.metadata.set(a.tagId, structuredClone(a));
      } else {
        const read = (job.payload as ScanJobPayload).tagRead;
        if (!this.registry.isTagRegistered(read.tagId)) throw new Error("TagNotRegistered");
        const check = this.tags.verifyTagRead(read);
        if (!check.valid || check.mode !== "mock") throw new Error("TagMessageInvalid");
        this.registry.verifyScan(read.tagId, read.counter);
      }
      return this.queue.updateJobStatus(id, "confirmed");
    } catch (error) {
      return this.queue.updateJobStatus(id, "failed", {
        error: error instanceof Error ? error.message : "UnexpectedError",
      });
    }
  }
}
