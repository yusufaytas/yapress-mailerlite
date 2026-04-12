import { NextRequest, NextResponse } from "next/server";

import { config as newsletterConfig } from "../../../../../../plugins/mailerlite-newsletter/config";
import { subscribeWithMailerLite } from "@/plugins/mailerlite-newsletter/api";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestLog = new Map<string, number[]>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const host = request.headers.get("host");

  if (!host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recentRequests = (ipRequestLog.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestLog.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  ipRequestLog.set(ip, recentRequests);
  return false;
}

type SubscribeRequestBody = {
  email?: string;
  name?: string;
};

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 },
    );
  }

  const clientIp = getClientIp(request);

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { message: "Too many signup attempts. Please try again later." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | SubscribeRequestBody
    | null;

  const result = await subscribeWithMailerLite(newsletterConfig, {
    email: body?.email ?? "",
    name: body?.name ?? "",
  });

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json({
    message:
      newsletterConfig.ui.successMessage ??
      "Thanks for subscribing.",
  });
}
