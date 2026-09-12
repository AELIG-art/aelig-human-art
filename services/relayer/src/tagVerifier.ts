import { canonicalizeJson, isValidCounter, isValidTagId, type TagRead } from "@humanart/shared";
export interface TagVerificationResult {
  valid: boolean;
  mode: "disabled" | "mock";
  error?: string;
}
export class TagCryptogramVerifier {
  verifyTagRead(_read: TagRead): TagVerificationResult {
    void _read;
    return { valid: false, mode: "disabled", error: "TagVerifierUnavailable" };
  }
}
function fingerprint(read: TagRead): string {
  return canonicalizeJson({
    tagId: read.tagId,
    counter: read.counter,
    enc: read.enc ?? null,
    cmac: read.cmac ?? null,
  });
}
// Accept only exact injected synthetic fixtures. No AES or MAC verification occurs.
export class MockTagCryptogramVerifier extends TagCryptogramVerifier {
  private fixtures: Set<string>;
  constructor(reads: TagRead[]) {
    super();
    if (process.env.NODE_ENV === "production") throw new Error("MockDisabledInProduction");
    this.fixtures = new Set(reads.map(fingerprint));
  }
  override verifyTagRead(read: TagRead): TagVerificationResult {
    const valid =
      isValidTagId(read.tagId) &&
      isValidCounter(read.counter) &&
      this.fixtures.has(fingerprint(read));
    return { valid, mode: "mock", ...(!valid ? { error: "UnknownMockTagMessage" } : {}) };
  }
}
