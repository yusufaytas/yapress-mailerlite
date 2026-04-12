# `@yusufaytas/yapress-mailerlite`

MailerLite newsletter plugin for Yapress.

## Install

```bash
npm install @yusufaytas/yapress-mailerlite
```

## What You Need

Create a MailerLite API token and a subscriber group in MailerLite. The plugin needs:

- `MAILERLITE_API_TOKEN`: your MailerLite API token
- `MAILERLITE_GROUP_ID`: the MailerLite group ID new subscribers should be added to

Add them to `.env.local` in your Yapress site:

```bash
MAILERLITE_API_TOKEN=mlt_your_api_token
MAILERLITE_GROUP_ID=123456789012345678
```

## Wire It Into Yapress

### 1. Create plugin config

Create `plugins/mailerlite-newsletter/config.ts` in your Yapress site:

```ts
import type { MailerLiteNewsletterConfig } from '@yusufaytas/yapress-mailerlite';

const apiToken = process.env.MAILERLITE_API_TOKEN;
const groupId = process.env.MAILERLITE_GROUP_ID;

export const config: MailerLiteNewsletterConfig = {
  enabled: Boolean(apiToken && groupId),
  apiToken,
  groupId,
  order: 10,
  placement: {
    footer: false,
    afterPost: true,
  },
  ui: {
    eyebrow: 'Newsletter',
    title: 'Get new posts in your inbox',
    description:
      'Subscribe for new writing on software, leadership, and life.',
    emailPlaceholder: 'you@example.com',
    namePlaceholder: 'First name (optional)',
    buttonText: 'Subscribe',
    successMessage: "You're in. Check your inbox if MailerLite asks you to confirm.",
    privacyNote: 'No spam. Unsubscribe any time.',
  },
};
```

### 2. Register the plugin

Update `plugins.config.ts` in your Yapress site:

```ts
import type { Plugin } from '@/types/plugin';
import { createMailerLiteNewsletterPlugin } from '@yusufaytas/yapress-mailerlite';
import { config as mailerLiteConfig } from './plugins/mailerlite-newsletter/config';

export const plugins: Plugin[] = [
  createMailerLiteNewsletterPlugin(mailerLiteConfig) as Plugin,
];
```

### 3. Add the subscription API route

Create `src/app/api/plugins/mailerlite/subscribe/route.ts` in your Yapress site:

```ts
import { NextRequest, NextResponse } from 'next/server';

import { config as newsletterConfig } from '../../../../../../plugins/mailerlite-newsletter/config';
import { subscribeWithMailerLite } from '@yusufaytas/yapress-mailerlite';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestLog = new Map<string, number[]>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin) {
    return true;
  }

  const host = request.headers.get('host');

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
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 });
  }

  const clientIp = getClientIp(request);

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { message: 'Too many signup attempts. Please try again later.' },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as SubscribeRequestBody | null;

  const result = await subscribeWithMailerLite(newsletterConfig, {
    email: body?.email ?? '',
    name: body?.name ?? '',
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({
    message: newsletterConfig.ui.successMessage ?? 'Thanks for subscribing.',
  });
}
```

## Placement

The plugin supports two placements:

- `afterPost`: renders under blog posts only
- `footer`: renders in the site footer

If you want it only under posts:

```ts
placement: {
  afterPost: true,
  footer: false,
}
```

## Configuration Reference

```ts
type MailerLiteNewsletterConfig = {
  enabled: boolean;
  apiToken?: string;
  groupId?: string;
  order?: number;
  placement?: {
    footer?: boolean;
    afterPost?: boolean;
  };
  ui: {
    eyebrow?: string;
    title: string;
    description?: string;
    emailPlaceholder?: string;
    namePlaceholder?: string;
    buttonText?: string;
    successMessage?: string;
    privacyNote?: string;
  };
};
```

## Notes

- The plugin disables itself when `MAILERLITE_API_TOKEN` or `MAILERLITE_GROUP_ID` is missing.
- The subscription route should stay server-side because it uses your private MailerLite API token.
- The built-in form posts to `/api/plugins/mailerlite/subscribe`.

## Release

GitHub Actions publishes this package to npm from the manual `Release Package` workflow.

Run the `Release Package` workflow manually and choose a `patch`, `minor`, or `major` version bump. The workflow updates `package.json`, `package-lock.json`, and the exported plugin version, runs lint, typecheck, tests, and build once, publishes to npm, then commits and tags the successful release.

Before bumping, the workflow syncs its release base with the highest version already published on npm. That prevents a stale repository version from trying to publish a lower version than the registry already has.

This repository is configured for npm Trusted Publishing via GitHub Actions OIDC.

Before the workflow can publish, configure the package on npm to trust:

- repository: `yusufaytas/yapress-mailerlite`
- workflow: `.github/workflows/release.yml`
- package settings page: `https://www.npmjs.com/package/@yusufaytas/yapress-mailerlite/access`

The package `repository.url` in `package.json` must use npm's canonical GitHub form: `git+https://github.com/yusufaytas/yapress-mailerlite.git`.

Local `npm publish` does not support automatic provenance generation. Provenance is produced by the GitHub Actions release workflow through npm Trusted Publishing.

No `NPM_TOKEN` secret is required once Trusted Publishing is configured on npm.
