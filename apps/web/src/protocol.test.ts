import { describe, expect, it } from "vitest";

import { demoTagRead, isDemoTag, parseNfcUrl } from "./protocol";

describe("parseNfcUrl", () => {
  it("normalizes a valid tag ID without truncating a large decimal counter", () => {
    expect(
      parseNfcUrl(
        "https://humanart.example/verify?tag=ha-424-demo-00042&counter=90071992547409931234",
      ),
    ).toEqual({
      counter: "90071992547409931234",
      tagId: "HA-424-DEMO-00042",
    });
  });

  it("rejects incomplete or malformed NFC URL parameters", () => {
    expect(parseNfcUrl("https://humanart.example/verify?counter=1")).toBeNull();
    expect(
      parseNfcUrl("https://humanart.example/verify?tag=HA-424-DEMO-00042&counter=-1"),
    ).toBeNull();
    expect(
      parseNfcUrl("https://humanart.example/verify?tag=HA-424-DEMO-00042&counter=001"),
    ).toBeNull();
  });

  it("only recognizes the exact local fixture as a demo tag", () => {
    expect(isDemoTag(demoTagRead)).toBe(true);
    expect(isDemoTag({ ...demoTagRead, counter: "125" })).toBe(false);
  });
});
