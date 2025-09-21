import { NextResponse } from "next/server";
import { luluFetch } from "@/src/lib/lulu/client";
import { rateLimitRequest } from "@/src/lib/rate-limit";
import { createExternalId, handleLuluError, validationError } from "@/src/lib/api-utils";
import { logInfo } from "@/src/lib/logger";

const RATE_LIMIT = { limit: 30, windowMs: 60_000 };

const ALLOWED_SHIPPING_LEVELS = new Set([
  "MAIL",
  "PRIORITY_MAIL",
  "GROUND",
  "EXPEDITED",
  "EXPRESS",
]);

function hasValidLineItem(lineItem: any) {
  if (!lineItem) return false;
  if (lineItem.printable_id) {
    return true;
  }
  const printable = lineItem.printable_normalization;
  return (
    printable &&
    printable.interior?.source_url &&
    printable.cover?.source_url &&
    (printable.pod_package_id || lineItem.pod_package_id)
  );
}

export async function GET(request: Request) {
  const rate = rateLimitRequest(request, "lulu-print-jobs-get", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
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
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams(searchParams);

  try {
    const response = await luluFetch("/print-jobs/", {
      query,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Listagem de print-jobs consultada", { external_id: externalId });

    return NextResponse.json({ external_id: externalId, data: response }, { status: 200 });
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "lulu-print-jobs-post", RATE_LIMIT.limit, RATE_LIMIT.windowMs);
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

  let payload: any;
  try {
    payload = await request.json();
  } catch (error) {
    return validationError("JSON inválido no corpo da requisição.", externalId);
  }

  if (!payload?.line_items || !Array.isArray(payload.line_items) || payload.line_items.length === 0) {
    return validationError("line_items é obrigatório e deve conter ao menos um item.", externalId);
  }

  if (!payload.shipping_address?.phone_number) {
    return validationError("shipping_address.phone_number é obrigatório.", externalId);
  }

  if (!payload.shipping_level || !ALLOWED_SHIPPING_LEVELS.has(payload.shipping_level)) {
    return validationError(
      `shipping_level inválido. Utilize um dos valores: ${Array.from(ALLOWED_SHIPPING_LEVELS).join(", ")}.`,
      externalId,
    );
  }

  const hasValidItems = payload.line_items.every(hasValidLineItem);
  if (!hasValidItems) {
    return validationError(
      "Cada item deve possuir printable_id ou printable_normalization com interior/cover e pod_package_id.",
      externalId,
    );
  }

  try {
    const response = await luluFetch("/print-jobs/", {
      method: "POST",
      body: payload,
      headers: {
        "X-Request-Id": externalId,
      },
      externalId,
    });

    logInfo("Print job enviado à Lulu", { external_id: externalId });

    return NextResponse.json(
      {
        external_id: externalId,
        data: response,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleLuluError(error, externalId);
  }
}
