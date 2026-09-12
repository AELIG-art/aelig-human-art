import { describe, expect, it } from "vitest";
import { SimulatedHumanArtRegistry } from "./index.js";
import { keccak256 } from "@humanart/shared";
describe("local registry model", () => {
  const digest = keccak256("fixture");
  it("allocates a tag, preserves counters and rejects replay", () => {
    const r = new SimulatedHumanArtRegistry();
    r.registerTag("HA-TEST", digest);
    expect(() => r.activateArtwork("HA-TEST", "ipfs://test", digest, "artist", 100n)).toThrow(
      "TagAllocationMismatch",
    );
    r.allocateTag("HA-TEST", "artist");
    r.activateArtwork("HA-TEST", "ipfs://test", digest, "artist", 100n);
    expect(r.verifyScan("HA-TEST", 102n)).toBe(true);
    expect(() => r.verifyScan("HA-TEST", 101n)).toThrow("CounterNotMonotonic");
    expect(() => r.allocateTag("HA-TEST", "other")).toThrow("TagAlreadyActivated");
  });
  it("rolls back an invalid batch", () => {
    const r = new SimulatedHumanArtRegistry();
    expect(() => r.registerTagsBatch(["HA-FIRST", "HA-FIRST"], [digest, digest])).toThrow();
    expect(r.isTagRegistered("HA-FIRST")).toBe(false);
  });
  it("rejects unsafe and out-of-range counters", () => {
    const r = new SimulatedHumanArtRegistry();
    r.registerTag("HA-TEST", digest);
    r.allocateTag("HA-TEST", "artist");
    for (const value of [-1n, 1n << 256n, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => r.activateArtwork("HA-TEST", "ipfs://test", digest, "artist", value)).toThrow(
        "InvalidCounter",
      );
      expect(r.isArtworkActivated("HA-TEST")).toBe(false);
    }
  });
});
