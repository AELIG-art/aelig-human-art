import { isValidCounter, isValidTagId } from "@humanart/shared";
export interface OnChainArtworkRecord {
  metadataURI: string;
  metadataDigest: string;
  authorId: string;
  lastCounter: bigint;
  activatedAt: number;
  isActivated: boolean;
}
function counter(value: bigint | number | string): bigint {
  if (typeof value === "number" && !Number.isSafeInteger(value)) throw new Error("InvalidCounter");
  if (!isValidCounter(String(value))) throw new Error("InvalidCounter");
  return BigInt(value);
}
function tagInput(tagId: string, commitment: string) {
  if (
    !isValidTagId(tagId) ||
    !/^0x[0-9a-fA-F]{64}$/.test(commitment) ||
    /^0x0+$/.test(commitment)
  ) {
    throw new Error("InvalidTagRegistration");
  }
}
// Local state model only. It does not execute Solidity or model wallet authorization.
export class SimulatedHumanArtRegistry {
  readonly mode = "mock";
  private tags = new Map<string, string>();
  private allocations = new Map<string, string>();
  private artworks = new Map<string, OnChainArtworkRecord>();
  constructor() {
    if (process.env.NODE_ENV === "production") throw new Error("MockDisabledInProduction");
  }
  registerTag(tagId: string, commitmentHash: string): void {
    this.registerTagsBatch([tagId], [commitmentHash]);
  }
  registerTagsBatch(tagIds: string[], commitments: string[]): void {
    if (tagIds.length !== commitments.length) throw new Error("MismatchedInputLength");
    const seen = new Set<string>();
    tagIds.forEach((id, i) => {
      tagInput(id, commitments[i]!);
      if (this.tags.has(id) || seen.has(id)) throw new Error("TagAlreadyRegistered");
      seen.add(id);
    });
    tagIds.forEach((id, i) => this.tags.set(id, commitments[i]!));
  }
  allocateTag(tagId: string, authorId: string): void {
    if (!this.tags.has(tagId)) throw new Error("TagNotRegistered");
    if (!authorId) throw new Error("EmptyAuthorId");
    if (this.artworks.has(tagId)) throw new Error("TagAlreadyActivated");
    this.allocations.set(tagId, authorId);
  }
  validateActivation(
    tagId: string,
    uri: string,
    digest: string,
    authorId: string,
    initial: bigint | number | string,
  ) {
    if (!this.tags.has(tagId)) throw new Error("TagNotRegistered");
    if (this.artworks.has(tagId)) throw new Error("TagAlreadyActivated");
    if (!authorId || this.allocations.get(tagId) !== authorId)
      throw new Error("TagAllocationMismatch");
    if (!uri.trim()) throw new Error("EmptyMetadataURI");
    if (!/^0x[0-9a-fA-F]{64}$/.test(digest) || /^0x0+$/.test(digest))
      throw new Error("InvalidMetadataDigest");
    return counter(initial);
  }
  activateArtwork(
    tagId: string,
    metadataURI: string,
    metadataDigest: string,
    authorId: string,
    initial: bigint | number | string,
  ): void {
    const lastCounter = this.validateActivation(
      tagId,
      metadataURI,
      metadataDigest,
      authorId,
      initial,
    );
    this.artworks.set(tagId, {
      metadataURI,
      metadataDigest,
      authorId,
      lastCounter,
      activatedAt: Math.floor(Date.now() / 1000),
      isActivated: true,
    });
  }
  verifyScan(tagId: string, value: bigint | number | string): boolean {
    const artwork = this.artworks.get(tagId);
    if (!artwork) throw new Error("ArtworkNotActivated");
    const next = counter(value);
    if (next <= artwork.lastCounter) throw new Error("CounterNotMonotonic");
    artwork.lastCounter = next;
    return true;
  }
  getArtwork(tagId: string): OnChainArtworkRecord {
    const artwork = this.artworks.get(tagId);
    if (!artwork) throw new Error("ArtworkNotActivated");
    return { ...artwork };
  }
  isTagRegistered(tagId: string): boolean {
    return this.tags.has(tagId);
  }
  isArtworkActivated(tagId: string): boolean {
    return this.artworks.has(tagId);
  }
}
