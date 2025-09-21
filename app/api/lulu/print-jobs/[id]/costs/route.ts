import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 80, windowMs: 60_000 };

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const rate = rateLimitRequest(request, "lulu-print-jobs-costs", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMITED", retry_after_ms: rate.retryAfter ?? RATE_LIMIT.windowMs },
      {
        status: 429,
        headers: rate.retryAfter ? { "Retry-After": Math.ceil((rate.retryAfter ?? 0) / 1000).toString() } : undefined,
      },
    );
  }

  const externalId = createExternalId(request.headers.get("x-external-id"));
  const jobId = params.id;

  try {
    const response = await luluFetch(`/print-jobs/${jobId}/costs/`, {
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Custos do print job consultados", { external_id: externalId, job_id: jobId });

    return NextResponse.json({ external_id: externalId, data: response }, { status: 200 });
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
