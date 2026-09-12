export type TagRead = {
  counter: string;
  tagId: string;
};

export const demoTagRead: TagRead = {
  counter: "124",
  tagId: "HA-424-DEMO-00042",
};

const tagIdPattern = /^[A-Z0-9][A-Z0-9-]{4,63}$/;
const counterPattern = /^(0|[1-9]\d*)$/;

export function normalizeTagId(value: string): string {
  return value.trim().toUpperCase();
}

export function parseNfcUrl(rawUrl: string | null): TagRead | null {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);
    const tagId = normalizeTagId(url.searchParams.get("tag") ?? "");
    const counter = url.searchParams.get("counter") ?? "";

    if (!tagIdPattern.test(tagId) || !counterPattern.test(counter)) {
      return null;
    }

    return { counter, tagId };
  } catch {
    return null;
  }
}

export function isDemoTag(read: TagRead): boolean {
  return (
    read.tagId === demoTagRead.tagId && read.counter === demoTagRead.counter
  );
}
