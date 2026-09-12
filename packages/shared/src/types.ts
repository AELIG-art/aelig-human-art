/**
 * Shared domain types for the HumanArt protocol.
 */

export interface ArtworkMetadata {
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions?: string;
  edition?: string;
  description?: string;
  imageUri: string;
  imageHash?: string;
  attributes?: Record<string, string | number | boolean>;
}

export interface ArtistIdentity {
  authorId: string;
  worldNullifierHash?: string;
  verificationLevel: "selfie" | "orb" | "document" | "mock";
  verifiedAt: string;
}

export interface TagRead {
  tagId: string;
  counter: string;
  enc?: string;
  cmac?: string;
  rawUrl?: string;
}

export interface WorldProofPayload {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
  action?: string;
}

export interface ActivationPayload {
  activationRead: TagRead;
  tagId: string;
  metadata: ArtworkMetadata;
  metadataUri: string;
  metadataDigest: string;
  artist: ArtistIdentity;
  initialCounter: string;
  timestamp: number;
  worldProof?: WorldProofPayload;
  authorizationTicket?: string;
}

export interface VerificationReceipt {
  mode: "mock";
  tagStatus: "simulated" | "rejected";
  identityStatus: "mock" | "unavailable";
  metadataStatus: "matched" | "unavailable";
  tagId: string;
  counter: string;
  isAuthentic: boolean;
  status: "simulated" | "counter_replay" | "unregistered_tag" | "invalid_message" | "error";
  reason?: string;
  artwork?: ArtworkMetadata;
  artist?: ArtistIdentity;
  metadataUri?: string;
  lastVerifiedCounter?: string;
  verifiedAt: string;
  transactionHash?: string;
}

export interface TagCommitment {
  tagId: string;
  commitmentHash: string;
  issuedAt: number;
  batchId?: string;
  isActivated: boolean;
}
