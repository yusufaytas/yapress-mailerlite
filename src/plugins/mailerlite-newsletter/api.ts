import type { MailerLiteNewsletterConfig } from "./types";

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api/subscribers";

export type SubscribePayload = {
  email: string;
  name?: string;
};

export function validateSubscribePayload(payload: SubscribePayload) {
  const email = payload.email.trim().toLowerCase();
  const name = payload.name?.trim() ?? "";

  if (!email) {
    return { ok: false as const, message: "Email is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, message: "Enter a valid email address." };
  }

  if (name.length > 120) {
    return { ok: false as const, message: "Name is too long." };
  }

  return {
    ok: true as const,
    email,
    name,
  };
}

export async function subscribeWithMailerLite(
  config: MailerLiteNewsletterConfig,
  payload: SubscribePayload,
) {
  if (!config.enabled || !config.apiToken || !config.groupId) {
    return {
      ok: false as const,
      status: 503,
      message: "Newsletter signup is not configured.",
    };
  }

  const validation = validateSubscribePayload(payload);
  if (!validation.ok) {
    return {
      ok: false as const,
      status: 400,
      message: validation.message,
    };
  }

  const response = await fetch(MAILERLITE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: validation.email,
      groups: [config.groupId],
      resubscribe: true,
      fields: validation.name ? { name: validation.name } : undefined,
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as
    | { message?: string; errors?: Record<string, string[]> }
    | null;

  if (response.ok) {
    return {
      ok: true as const,
      status: response.status,
    };
  }

  const emailError = data?.errors?.email?.[0];

  return {
    ok: false as const,
    status: response.status,
    message:
      emailError ??
      data?.message ??
      "Subscription failed. Please try again.",
  };
}
