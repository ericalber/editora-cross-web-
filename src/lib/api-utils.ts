import { NextResponse } from "next/server";
import { LuluApiError } from "@/src/lib/lulu/client";
import { logError } from "@/src/lib/logger";
import { randomUUID } from "node:crypto";

export function createExternalId(headerValue?: string | null) {
  return headerValue?.trim() && headerValue.trim().length > 0 ? headerValue.trim() : randomUUID();
}

export function handleLuluError(error: unknown, externalId: string) {
  if (error instanceof LuluApiError) {
    logError("Lulu API error", {
      external_id: externalId,
      status: error.status,
      detail: error.detail,
    });
    return NextResponse.json(
      {
        error: "LULU_REQUEST_FAILED",
        status: error.status,
        detail: error.detail ?? error.message,
        external_id: externalId,
      },
      { status: error.status },
    );
  }

  logError("Unexpected error", { external_id: externalId, error: (error as Error)?.message });
  return NextResponse.json(
    {
      error: "INTERNAL_ERROR",
      message: "Ocorreu um erro inesperado ao falar com a Lulu.",
      external_id: externalId,
    },
    { status: 500 },
  );
}

export function validationError(message: string, externalId: string) {
  return NextResponse.json(
    {
      error: "INVALID_REQUEST",
      message,
      external_id: externalId,
    },
    { status: 400 },
  );
}
