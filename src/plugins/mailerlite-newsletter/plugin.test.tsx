import { describe, expect, it } from "vitest";

import { createMailerLiteNewsletterPlugin } from "./plugin";
import type { MailerLiteNewsletterConfig } from "./types";
import { PACKAGE_VERSION } from "../../version";

const baseConfig: MailerLiteNewsletterConfig = {
  enabled: true,
  form: {
    actionUrl:
      "https://assets.mailerlite.com/jsonp/2262555/forms/184541525793834716/subscribe",
  },
  placement: {
    afterPost: true,
  },
  ui: {
    title: "Join the newsletter",
  },
};

describe("createMailerLiteNewsletterPlugin", () => {
  it("registers afterPost component when enabled", () => {
    const plugin = createMailerLiteNewsletterPlugin(baseConfig);

    expect(plugin.enabled).toBe(true);
    expect(plugin.version).toBe(PACKAGE_VERSION);
    expect(plugin.components?.afterPost).toHaveLength(1);
    expect(plugin.components?.footerEnd).toBeUndefined();
  });

  it("disables the plugin when the hosted form action URL is missing", () => {
    const plugin = createMailerLiteNewsletterPlugin({
      ...baseConfig,
      form: {
        ...baseConfig.form,
        actionUrl: undefined,
      },
    });

    expect(plugin.enabled).toBe(false);
    expect(plugin.components?.afterPost).toBeUndefined();
  });
});
