import { describe, expect, it } from "vitest";
import { buildNfcUrl, parseNfcUrl } from "@humanart/shared";
import { createLocalDemo } from "../services/relayer/src/demo.js";

describe("in-memory lifecycle integration (not hardware, browser or EVM)", () => {
  it("activates a fixture, accepts a fresh scan and rejects replay and tampering", () => {
    const { registry, relayer, activation, reads } = createLocalDemo();
    expect(relayer.submitActivation(activation).status).toBe("confirmed");
    const read = parseNfcUrl(buildNfcUrl("https://humanart.example/", reads[1]!))!;
    const first = relayer.submitScanVerification(read);
    expect(first.receipt.status).toBe("simulated");
    expect(first.receipt.isAuthentic).toBe(false);
    expect(first.receipt.artist?.authorId).toBe(activation.artist.authorId);
    expect(relayer.submitScanVerification(read).receipt.status).toBe("counter_replay");
    expect(relayer.submitScanVerification({ ...reads[2]!, cmac: "0000" }).receipt.status).toBe(
      "invalid_message",
    );
    expect(registry.getArtwork(activation.tagId).lastCounter).toBe(101n);
    expect(relayer.submitScanVerification(reads[2]!).receipt.status).toBe("simulated");
    expect(
      relayer.submitScanVerification({ tagId: "HA-UNKNOWN", counter: "1" }).receipt.status,
    ).toBe("unregistered_tag");
  });
});
