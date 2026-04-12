import { describe, expect, it } from "vitest";

import { createMailerLiteNewsletterPlugin } from "./plugin";
import type { MailerLiteNewsletterConfig } from "./types";
import { PACKAGE_VERSION } from "../../version";

const baseConfig: MailerLiteNewsletterConfig = {
  enabled: true,
  apiToken: "token",
  groupId: "group",
  placement: {
    footer: true,
    afterPost: true,
  },
  ui: {
    title: "Join the newsletter",
  },
};

describe("createMailerLiteNewsletterPlugin", () => {
  it("registers components for enabled placements", () => {
    const plugin = createMailerLiteNewsletterPlugin(baseConfig);

    expect(plugin.enabled).toBe(true);
    expect(plugin.version).toBe(PACKAGE_VERSION);
    expect(plugin.components?.footerEnd).toHaveLength(1);
    expect(plugin.components?.afterPost).toHaveLength(1);
  });

  it("disables the plugin when required MailerLite credentials are missing", () => {
    const plugin = createMailerLiteNewsletterPlugin({
      ...baseConfig,
      apiToken: undefined,
    });

    expect(plugin.enabled).toBe(false);
    expect(plugin.components?.footerEnd).toBeUndefined();
    expect(plugin.components?.afterPost).toBeUndefined();
  });
});
