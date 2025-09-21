import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError } from "@/src/lib/api-utils";

const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

export async function GET(request: Request) {
  const rate = rateLimitRequest(request, "lulu-webhook-submissions", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rate.allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const externalId = createExternalId(request.headers.get("x-external-id"));
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams(searchParams);

  try {
    const response = await luluFetch("/webhook-submissions/", {
      query,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    return NextResponse.json({ external_id: externalId, data: response }, { status: 200 });
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
