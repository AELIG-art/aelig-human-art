import type { ActivationPayload, TagRead } from "@humanart/shared";
export type RelayJobType = "activate_artwork" | "verify_scan";
export type RelayJobStatus = "pending" | "processing" | "confirmed" | "failed";
export interface ActivationJobPayload {
  activation: ActivationPayload;
}
export interface ScanJobPayload {
  tagRead: TagRead;
}
export interface RelayJob {
  id: string;
  idempotencyKey: string;
  type: RelayJobType;
  status: RelayJobStatus;
  payload: ActivationJobPayload | ScanJobPayload;
  error?: string;
  attempts: number;
  createdAt: number;
  updatedAt: number;
}
