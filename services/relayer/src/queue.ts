import { randomUUID } from "node:crypto";
import { canonicalizeJson } from "@humanart/shared";
import type { RelayJob, RelayJobStatus, RelayJobType } from "./types.js";
// Process-local demonstration queue. No persistence, network retries or gas spending.
export class RelayerJobQueue {
  private jobs = new Map<string, RelayJob>();
  private keys = new Map<string, string>();
  enqueueJob(type: RelayJobType, key: string, payload: RelayJob["payload"]): RelayJob {
    if (!key.trim() || key.length > 256) throw new Error("InvalidIdempotencyKey");
    const existingId = this.keys.get(key);
    if (existingId) {
      const existing = this.jobs.get(existingId)!;
      if (
        existing.type !== type ||
        canonicalizeJson(existing.payload) !== canonicalizeJson(payload)
      ) {
        throw new Error("IdempotencyConflict");
      }
      return structuredClone(existing);
    }
    const now = Date.now();
    const job: RelayJob = {
      id: randomUUID(),
      idempotencyKey: key,
      type,
      payload: structuredClone(payload),
      status: "pending",
      attempts: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(job.id, job);
    this.keys.set(key, job.id);
    return structuredClone(job);
  }
  getJob(id: string): RelayJob | undefined {
    const job = this.jobs.get(id);
    return job ? structuredClone(job) : undefined;
  }
  getPendingJobs(): RelayJob[] {
    return [...this.jobs.values()]
      .filter((j) => j.status === "pending")
      .map((j) => structuredClone(j));
  }
  updateJobStatus(id: string, status: RelayJobStatus, updates: { error?: string } = {}): RelayJob {
    const job = this.jobs.get(id);
    if (!job) throw new Error("JobNotFound");
    const allowed =
      (job.status === "pending" && status === "processing") ||
      (job.status === "processing" && ["failed", "confirmed"].includes(status));
    if (!allowed) throw new Error("InvalidJobTransition");
    job.status = status;
    job.updatedAt = Date.now();
    if (updates.error) job.error = updates.error;
    if (status === "processing") job.attempts++;
    return structuredClone(job);
  }
}
