import type { TagRead } from "./types";

const tagIdPattern = /^[A-Z0-9][A-Z0-9-]{4,63}$/;
const counterPattern = /^(0|[1-9]\d{0,77})$/;
export const MAX_COUNTER = (1n << 256n) - 1n;

export function normalizeTagId(value: string): string {
  return value.trim().toUpperCase();
}
export function isValidCounter(counter: string): boolean {
  return counterPattern.test(counter) && BigInt(counter) <= MAX_COUNTER;
}
export function isValidTagId(tagId: string): boolean {
  return tagIdPattern.test(tagId);
}

// This is HumanArt's synthetic URL envelope, not the NTAG 424 hardware wire format.
// Public counters and identifiers are untrusted hints, never cryptographic evidence.
export function parseNfcUrl(rawUrl: string | null | undefined): TagRead | null {
  if (!rawUrl || rawUrl.length > 4096) return null;
  try {
    const url = new URL(rawUrl);
    if (!["https:", "http:", "humanart:"].includes(url.protocol)) return null;
    const params = url.searchParams;
    const allowed = ["tag", "counter", "enc", "cmac"];
    if ([...params.keys()].some((key) => !allowed.includes(key))) return null;
    if (allowed.some((key) => params.getAll(key).length > 1)) return null;
    const tagId = normalizeTagId(params.get("tag") ?? "");
    const counter = params.get("counter") ?? "";
    if (!isValidTagId(tagId) || !isValidCounter(counter)) return null;
    const read: TagRead = { tagId, counter };
    for (const key of ["enc", "cmac"] as const) {
      const value = params.get(key);
      if (value !== null) {
        if (!/^(?:[0-9a-fA-F]{2})+$/.test(value)) return null;
        read[key] = value.toLowerCase();
      }
    }
    return read;
  } catch {
    return null;
  }
}

export function buildNfcUrl(baseUrl: string, read: TagRead): string {
  const url = new URL(baseUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set("tag", normalizeTagId(read.tagId));
  url.searchParams.set("counter", read.counter);
  if (read.enc !== undefined) url.searchParams.set("enc", read.enc);
  if (read.cmac !== undefined) url.searchParams.set("cmac", read.cmac);
  if (!parseNfcUrl(url.toString())) throw new Error("InvalidTagRead");
  return url.toString();
}
