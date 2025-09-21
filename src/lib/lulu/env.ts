const REQUIRED_ENV = [
  "LULU_CLIENT_KEY",
  "LULU_CLIENT_SECRET",
  "LULU_OAUTH_TOKEN_URL",
  "LULU_BASE_URL_SANDBOX",
  "LULU_BASE_URL_PROD",
];

function assertEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getBaseUrl() {
  const env = (process.env.LULU_ENV ?? "sandbox").toLowerCase();
  return env === "prod" || env === "production"
    ? assertEnv("LULU_BASE_URL_PROD")
    : assertEnv("LULU_BASE_URL_SANDBOX");
}

export function getOAuthTokenUrl() {
  return assertEnv("LULU_OAUTH_TOKEN_URL");
}

export function getClientCredentials() {
  const key = assertEnv("LULU_CLIENT_KEY");
  const secret = assertEnv("LULU_CLIENT_SECRET");
  return { key, secret };
}

export function getWebhookSecret() {
  return process.env.LULU_WEBHOOK_SECRET ?? "";
}

// Ensure required envs are defined during module evaluation for fail-fast behaviour
REQUIRED_ENV.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing environment variable: ${name}`);
  }
});
