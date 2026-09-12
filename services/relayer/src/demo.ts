import { SimulatedHumanArtRegistry } from "@humanart/contracts";
import { MockWorldIdVerifierService, computeActivationSignal } from "@humanart/world-service";
import {
  SAMPLE_ARTWORK_METADATA,
  computeArtworkDigest,
  keccak256,
  type ActivationPayload,
} from "@humanart/shared";
import { MockTagCryptogramVerifier } from "./tagVerifier.js";
import { MockHumanArtRelayerService } from "./relayer.js";

export function createLocalDemo() {
  const registry = new SimulatedHumanArtRegistry();
  const world = new MockWorldIdVerifierService();
  const tagId = "HA-424-DEMO-00042";
  const reads = ["100", "101", "102"].map((counter) => ({
    tagId,
    counter,
    enc: "01020304",
    cmac: "aabbccdd",
  }));
  const tagVerifier = new MockTagCryptogramVerifier(reads);
  const relayer = new MockHumanArtRelayerService(registry, world, tagVerifier);
  const metadata = structuredClone(SAMPLE_ARTWORK_METADATA);
  const metadataDigest = computeArtworkDigest(metadata);
  const identity = world.verifyProof(tagId, metadataDigest, {
    merkle_root: "mock",
    nullifier_hash: "synthetic-artist-1",
    proof: "humanart-local-fixture",
    verification_level: "mock",
    signal: computeActivationSignal(tagId, metadataDigest),
    action: "mock-activate-artwork",
  });
  if (!identity.valid || !identity.artist || !identity.authorizationTicket)
    throw new Error("DemoSetupFailed");
  registry.registerTag(tagId, keccak256("synthetic-tag-registration"));
  registry.allocateTag(tagId, identity.artist.authorId);
  const activation: ActivationPayload = {
    tagId,
    metadata,
    metadataDigest,
    metadataUri: "ipfs://example-only/metadata.json",
    artist: identity.artist,
    initialCounter: "100",
    activationRead: reads[0]!,
    timestamp: Date.now(),
    authorizationTicket: identity.authorizationTicket,
  };
  return { registry, world, relayer, reads, activation };
}
