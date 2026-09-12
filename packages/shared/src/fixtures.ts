import type { ArtworkMetadata, TagRead } from "./types.js";
export const DEMO_TAG_READ: TagRead = {
  tagId: "HA-424-DEMO-00042",
  counter: "124",
  enc: "0102030405060708090a0b0c0d0e0f10",
  cmac: "abcdef0123456789",
};
export const SAMPLE_ARTWORK_METADATA: ArtworkMetadata = {
  title: "Synthetic artwork fixture",
  artist: "Example artist",
  year: 2026,
  medium: "Example print",
  description: "Synthetic data for local tests; no physical artwork or verified identity.",
  imageUri: "ipfs://example-only/image.jpg",
  attributes: { environment: "mock" },
};
export const MALFORMED_NFC_URLS = [
  "https://humanart.example/verify",
  "https://humanart.example/verify?counter=1",
  "https://humanart.example/verify?tag=HA-424-DEMO-00042",
  "https://humanart.example/verify?tag=HA-424-DEMO-00042&counter=-1",
  "https://humanart.example/verify?tag=HA-424-DEMO-00042&counter=001",
  "https://humanart.example/verify?tag=INVALID$$TAG&counter=10",
  "https://humanart.example/verify?tag=HA-424-DEMO-00042&counter=10&enc=not_hex",
];
