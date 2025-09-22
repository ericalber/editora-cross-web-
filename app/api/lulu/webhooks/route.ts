import { NextResponse } from "next/server";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { getWebhookSecret } from "@/src/lib/lulu/env";
import { logError, logInfo } from "@/src/lib/logger";
import { createExternalId } from "@/src/lib/api-utils";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RATE_LIMIT = { limit: 100, windowMs: 60_000 };
const EVENTS_DIR = join(process.cwd(), "data", "webhooks");

function ensureDir() {
  mkdirSync(EVENTS_DIR, { recursive: true });
}

function verifySignature(rawBody: Buffer, signatureHeader: string | null) {
  if (!signatureHeader) return false;
  const secret = getWebhookSecret();
  if (!secret) return false;
  const hmac = createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest();
  try {
    const received = Buffer.from(signatureHeader, "hex");
    if (received.length !== digest.length) {
      return false;
    }
    return timingSafeEqual(digest, received);
  } catch {
    return false;
  }
}

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "lulu-webhook", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const externalId = createExternalId(request.headers.get("x-external-id"));
  const signature = request.headers.get("Lulu-HMAC-SHA256");
  const rawArrayBuffer = await request.arrayBuffer();
  const rawBody = Buffer.from(rawArrayBuffer);

  if (!verifySignature(rawBody, signature)) {
    logError("Lulu webhook assinatura inválida", { external_id: externalId });
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody.toString("utf-8"));
  } catch {
    // continuar com payload bruto
  }

  try {
    ensureDir();
    const fileName = `${Date.now()}_${randomUUID()}.json`;
    const dataToPersist = {
      received_at: new Date().toISOString(),
      external_id: externalId,
      signature,
      payload,
    };
    writeFileSync(join(EVENTS_DIR, fileName), JSON.stringify(dataToPersist, null, 2));
  } catch (error) {
    logError("Falha ao persistir webhook da Lulu", { external_id: externalId, error: (error as Error).message });
  }

  if (isJsonRecord(payload) && payload.job_id !== undefined) {
    const jobId = payload.job_id;
    const name = typeof payload.name === "string" ? payload.name : undefined;
    const message = typeof payload.message === "string" ? payload.message : undefined;
    logInfo("Webhook Lulu recebido", {
      external_id: externalId,
      job_id: jobId,
      name,
      message,
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
