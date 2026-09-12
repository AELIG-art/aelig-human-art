import { randomUUID } from "node:crypto";
import type { ArtistIdentity, WorldProofPayload } from "@humanart/shared";
import { deriveAuthorId } from "./author.js";
import { computeActivationSignal } from "./signal.js";

export interface TicketPayload {
  tagId: string;
  metadataDigest: string;
  authorId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}
export interface VerificationResult {
  valid: boolean;
  error?: string;
  artist?: ArtistIdentity;
  authorizationTicket?: string;
}
export class WorldIdVerifierService {
  readonly mode: "disabled" | "mock";
  private tickets = new Map<string, TicketPayload>();
  private consumed = new Set<string>();
  private issuedProofs = new Set<string>();
  constructor(mode: "disabled" | "mock" = "disabled") {
    if (mode === "mock" && process.env.NODE_ENV === "production")
      throw new Error("MockDisabledInProduction");
    this.mode = mode;
  }
  public verifyProof(
    tagId: string,
    metadataDigest: string,
    proof: WorldProofPayload,
  ): VerificationResult {
    if (this.mode !== "mock") return { valid: false, error: "WorldIntegrationUnavailable" };
    if (
      !proof ||
      proof.signal !== computeActivationSignal(tagId, metadataDigest) ||
      proof.action !== "mock-activate-artwork" ||
      proof.verification_level !== "mock" ||
      proof.proof !== "humanart-local-fixture" ||
      !proof.nullifier_hash?.trim()
    ) {
      return { valid: false, error: "InvalidMockProofContext" };
    }
    const proofKey = JSON.stringify([proof.nullifier_hash, proof.signal]);
    if (this.issuedProofs.has(proofKey)) return { valid: false, error: "MockProofAlreadyUsed" };
    const now = Date.now();
    const authorId = deriveAuthorId(proof.nullifier_hash);
    const token = "mock_ticket_" + randomUUID();
    this.tickets.set(token, {
      tagId,
      metadataDigest,
      authorId,
      issuedAt: now,
      expiresAt: now + 600_000,
      nonce: randomUUID(),
    });
    this.issuedProofs.add(proofKey);
    return {
      valid: true,
      artist: { authorId, verificationLevel: "mock", verifiedAt: new Date(now).toISOString() },
      authorizationTicket: token,
    };
  }
  public validateTicket(
    token: string,
    expected: Pick<TicketPayload, "tagId" | "metadataDigest" | "authorId">,
  ) {
    if (this.consumed.has(token)) throw new Error("TicketAlreadyConsumed");
    const ticket = this.tickets.get(token);
    if (!ticket) throw new Error("InvalidAuthorizationTicket");
    if (ticket.expiresAt <= Date.now()) throw new Error("TicketExpired");
    if (
      ticket.tagId !== expected.tagId ||
      ticket.metadataDigest !== expected.metadataDigest ||
      ticket.authorId !== expected.authorId
    )
      throw new Error("TicketContextMismatch");
    return { ...ticket };
  }
  public consumeTicket(
    token: string,
    expected: Pick<TicketPayload, "tagId" | "metadataDigest" | "authorId">,
  ): void {
    this.validateTicket(token, expected);
    this.consumed.add(token);
  }
}
export class MockWorldIdVerifierService extends WorldIdVerifierService {
  constructor() {
    super("mock");
  }
}
