import { getClientCredentials, getOAuthTokenUrl } from "./env";

interface CachedToken {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cachedToken: CachedToken | null = null;

const SAFETY_WINDOW_MS = 60_000; // renew 1 min before expiry

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - SAFETY_WINDOW_MS > Date.now()) {
    return cachedToken.accessToken;
  }

  const { key, secret } = getClientCredentials();
  const tokenUrl = getOAuthTokenUrl();
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errJson = await response.json();
      detail = errJson.error_description ?? errJson.error ?? detail;
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(`Lulu OAuth failed (${response.status}): ${detail}`);
  }

  const json: {
    access_token: string;
    expires_in: number;
    token_type?: string;
  } = await response.json();

  cachedToken = {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 0) * 1000,
  };

  return cachedToken.accessToken;
}

export function clearCachedToken() {
  cachedToken = null;
}
