import { canonicalizeJson, keccak256 } from "@humanart/shared";
export function computeActivationSignal(tagId: string, metadataDigest: string): string {
  if (!tagId || !metadataDigest) throw new Error("MissingTagIdOrMetadataDigest");
  return keccak256(canonicalizeJson(["HUMANART_MOCK_ACTIVATION_V1", tagId, metadataDigest]));
}
