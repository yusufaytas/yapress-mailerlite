# `@yusufaytas/yapress-mailerlite`

MailerLite newsletter plugin for Yapress.

## Install

```bash
npm install @yusufaytas/yapress-mailerlite
```

## What You Need

Create a MailerLite embedded or hosted form and copy its public form action URL. It will look similar to:

```txt
https://assets.mailerlite.com/jsonp/<number>/forms/<number>/subscribe
```

This plugin uses your own markup and CSS and submits directly to that MailerLite endpoint. No Yapress API route or private MailerLite token is required.

## Setup

### 1. Set environment variable

Add to your `.env.local`:

```bash
MAILERLITE_FORM_ACTION_URL=https://assets.mailerlite.com/jsonp/<number>/forms/<number>/subscribe
```

### 2. Create plugin config

Create `plugins/mailerlite-newsletter/config.ts` in your Yapress site:

```ts
import type { MailerLiteNewsletterConfig } from '@yusufaytas/yapress-mailerlite';

const formActionUrl = process.env.MAILERLITE_FORM_ACTION_URL;

export const config: MailerLiteNewsletterConfig = {
  enabled: Boolean(formActionUrl),
  form: {
    actionUrl: formActionUrl,
  },
  order: 10,
  placement: {
    afterPost: true,
  },
  ui: {
    eyebrow: 'Newsletter',
    title: 'Get new posts in your inbox',
    description: 'Subscribe for posts.',
    emailPlaceholder: 'you@example.com',
    namePlaceholder: 'First name (optional)',
    buttonText: 'Subscribe',
    successMessage: 'Thanks for subscribing.',
    privacyNote: 'No spam. Unsubscribe any time.',
  },
};
```

### 3. Register the plugin

Update `plugins.config.ts` in your Yapress site:

```ts
import type { Plugin } from '@/types/plugin';
import { createMailerLiteNewsletterPlugin } from '@yusufaytas/yapress-mailerlite';
import { config as mailerLiteConfig } from './plugins/mailerlite-newsletter/config';

export const plugins: Plugin[] = [
  createMailerLiteNewsletterPlugin(mailerLiteConfig),
];
```

## Placement

The plugin only supports `afterPost` placement, which renders the newsletter form after blog post content in the article footer.

## Configuration Reference

```ts
type MailerLiteNewsletterConfig = {
  enabled: boolean;
  form: {
    actionUrl?: string;
    emailFieldName?: string;
    nameFieldName?: string;
    submitValue?: string;
    antiCsrfValue?: string;
  };
  order?: number;
  placement?: {
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

## Features

- **Client-side only**: Form submits directly to MailerLite, no server-side code needed
- **Remembers subscription**: Uses localStorage to hide form after successful subscription
- **Disabled state**: Form inputs and button are disabled after submission (not hidden)
- **Yapress theme integration**: Uses yapress CSS variables for consistent styling
- **Responsive**: Two-column layout on desktop, stacked on mobile

## Notes

- The plugin disables itself when `form.actionUrl` is missing
- The form posts directly to your MailerLite hosted form endpoint using `mode: 'no-cors'`
- After successful submission, the form is disabled but remains visible with the success message
- The form only hides on page reload if the user has already subscribed (checked via localStorage)

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
