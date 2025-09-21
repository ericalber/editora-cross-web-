import { getBaseUrl } from "./env";
import { getAccessToken } from "./oauth";

export interface LuluFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: URLSearchParams | Record<string, string | number | boolean | undefined>;
  externalId?: string;
}

export class LuluApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

function buildQueryString(query?: LuluFetchOptions["query"]): string {
  if (!query) return "";
  if (query instanceof URLSearchParams) {
    const qs = query.toString();
    return qs ? `?${qs}` : "";
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function luluFetch<T = unknown>(path: string, options: LuluFetchOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const baseUrl = getBaseUrl();
  const queryString = buildQueryString(options.query);
  const url = `${baseUrl}${path}${queryString}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers ?? {}),
  };

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
    cache: "no-store",
  };

  if (options.body !== undefined) {
    init.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => undefined) : await response.text().catch(() => undefined);

  if (!response.ok) {
    const statusDetail = isJson ? payload : undefined;
    throw new LuluApiError(
      response.status,
      `Lulu request failed (${response.status} ${response.statusText})`,
      statusDetail,
    );
  }

  return (isJson ? (payload as T) : (payload as unknown as T));
}
