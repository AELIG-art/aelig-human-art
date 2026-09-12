import { describe, expect, it } from "vitest";
import { canonicalizeJson, computeArtworkDigest, keccak256 } from "./canonical";
import { SAMPLE_ARTWORK_METADATA } from "./fixtures";

describe("metadata commitments", () => {
  it("matches a byte-level canonical JSON vector", () => {
    expect(canonicalizeJson({ z: 1, a: "test", m: [3, 2, 1] })).toBe(
      '{"a":"test","m":[3,2,1],"z":1}',
    );
  });
  it.each([
    undefined,
    NaN,
    Infinity,
    { x: undefined },
    [undefined],
    new Array(1),
    new Date(),
    "\ud800",
  ])("rejects non-JSON and invalid Unicode input: %s", (value) => {
    expect(() => canonicalizeJson(value)).toThrow();
  });
  it("rejects cycles", () => {
    const v: Record<string, unknown> = {};
    v.self = v;
    expect(() => canonicalizeJson(v)).toThrow("CyclicJson");
  });
  it("matches independent Ethereum Keccak vectors", () => {
    expect(keccak256("")).toBe(
      "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
    );
    expect(keccak256("abc")).toBe(
      "0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45",
    );
  });
  it("detects metadata changes", () => {
    expect(computeArtworkDigest(SAMPLE_ARTWORK_METADATA)).not.toBe(
      computeArtworkDigest({ ...SAMPLE_ARTWORK_METADATA, title: "Altered" }),
    );
  });
});
