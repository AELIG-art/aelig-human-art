import { canonicalizeJson, keccak256 } from "@humanart/shared";

// Only call after credential validation. Mock IDs occupy a separate fixed scope.
export function deriveAuthorId(nullifierHash: string): string {
  if (!nullifierHash.trim()) throw new Error("InvalidNullifierHash");
  return (
    "ha_mock_author_" +
    keccak256(
      canonicalizeJson(["HUMANART_MOCK_ARTIST_V1", "local-enrollment", nullifierHash]),
    ).slice(2)
  );
}
