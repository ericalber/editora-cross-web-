import { NextResponse, type NextRequest } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 80, windowMs: 60_000 };

type RouteContext = { params: { id: string } };

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  const rate = rateLimitRequest(request, "lulu-validate-cover-status", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
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
  const validationId = params.id;

  try {
    const response = await luluFetch(`/validate-cover/${validationId}/`, {
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Status de validação de capa consultado", { external_id: externalId, validation_id: validationId });

    return NextResponse.json({ external_id: externalId, data: response }, { status: 200 });
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
