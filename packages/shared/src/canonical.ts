import serialize from "canonicalize";
import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils";
import type { ArtworkMetadata } from "./types.js";

// Restrict commitments to JSON data: reject silent coercions, sparse arrays,
// cyclic structures and lone surrogates before invoking JCS.
function validateJson(value: unknown, ancestors = new Set<object>()): void {
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "string") {
    for (const character of value) {
      const point = character.codePointAt(0)!;
      if (point >= 0xd800 && point <= 0xdfff) throw new Error("InvalidUnicode");
    }
    return;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("InvalidJsonNumber");
    return;
  }
  if (typeof value !== "object") throw new Error("InvalidJsonValue");
  if (ancestors.has(value)) throw new Error("CyclicJson");
  ancestors.add(value);
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) validateJson(value[i], ancestors);
  } else {
    if (
      Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null
    ) {
      throw new Error("NonJsonObject");
    }
    for (const [key, child] of Object.entries(value)) {
      validateJson(key, ancestors);
      validateJson(child, ancestors);
    }
  }
  ancestors.delete(value);
}

export function canonicalizeJson(value: unknown): string {
  validateJson(value);
  const result = serialize(value);
  if (result === undefined) throw new Error("InvalidJsonValue");
  return result;
}

export function keccak256(data: Uint8Array | string): string {
  return "0x" + bytesToHex(keccak_256(typeof data === "string" ? utf8ToBytes(data) : data));
}

export function computeArtworkDigest(metadata: ArtworkMetadata): string {
  return keccak256(canonicalizeJson(metadata));
}
