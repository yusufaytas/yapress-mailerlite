# `@yusufaytas/yapress-mailerlite`

MailerLite newsletter plugin for Yapress.

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
