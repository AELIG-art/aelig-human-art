export {
  type TagRead,
  normalizeTagId,
  parseNfcUrl,
  buildNfcUrl,
  isValidCounter,
  isValidTagId,
} from "@humanart/shared";

import { TagRead } from "@humanart/shared";

export const demoTagRead: TagRead = {
  counter: "124",
  tagId: "HA-424-DEMO-00042",
};

export function isDemoTag(read: TagRead): boolean {
  return read.tagId === demoTagRead.tagId && read.counter === demoTagRead.counter;
}
