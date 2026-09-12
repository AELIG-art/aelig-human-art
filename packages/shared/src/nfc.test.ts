import { describe, expect, it } from "vitest";
import { buildNfcUrl, parseNfcUrl, MAX_COUNTER } from "./nfc";
import { DEMO_TAG_READ, MALFORMED_NFC_URLS } from "./fixtures";
describe("synthetic NFC envelope", () => {
  it("round-trips the fixture without losing large counters", () => {
    const read = { ...DEMO_TAG_READ, counter: MAX_COUNTER.toString() };
    expect(parseNfcUrl(buildNfcUrl("https://humanart.example", read))).toEqual(read);
  });
  it.each([
    ...MALFORMED_NFC_URLS,
    "https://humanart.example/?tag=HA-TEST&counter=1&counter=2",
    "https://humanart.example/?tag=HA-TEST&counter=1&cmac=abc",
    "https://humanart.example/?tag=HA-TEST&counter=1&enc=",
    "https://humanart.example/?picc_data=HA-TEST&counter=1",
    "javascript:alert(1)?tag=HA-TEST&counter=1",
    "https://humanart.example/?tag=HA-TEST&counter=" + (MAX_COUNTER + 1n),
  ])("rejects malformed or ambiguous input: %s", (url) => expect(parseNfcUrl(url)).toBeNull());
  it("handles the native app scheme", () => {
    expect(parseNfcUrl("humanart://verify?tag=HA-TEST&counter=0")).toEqual({
      tagId: "HA-TEST",
      counter: "0",
    });
  });
  it("rejects malformed builder input", () => {
    expect(() =>
      buildNfcUrl("https://humanart.example", { ...DEMO_TAG_READ, counter: "-1" }),
    ).toThrow();
  });
});
