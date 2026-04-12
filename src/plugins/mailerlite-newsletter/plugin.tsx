import type { Plugin } from "../../types/plugin";
import { PACKAGE_VERSION } from "../../version";

import { NewsletterForm } from "./newsletter-form";
import type { MailerLiteNewsletterConfig } from "./types";

function buildComponent(
  config: MailerLiteNewsletterConfig,
  layout: "footer" | "afterPost",
) {
  return function MailerLiteNewsletterPluginComponent() {
    return (
      <NewsletterForm
        layout={layout}
        eyebrow={config.ui.eyebrow}
        title={config.ui.title}
        description={config.ui.description}
        emailPlaceholder={config.ui.emailPlaceholder}
        namePlaceholder={config.ui.namePlaceholder}
        buttonText={config.ui.buttonText}
        successMessage={config.ui.successMessage}
        privacyNote={config.ui.privacyNote}
      />
    );
  };
}

export function createMailerLiteNewsletterPlugin(
  config: MailerLiteNewsletterConfig,
): Plugin {
  const isConfigured = Boolean(config.enabled && config.apiToken && config.groupId);
  const components: Plugin["components"] = {};

  if (isConfigured && config.placement?.afterPost) {
    components.afterPost = [buildComponent(config, "afterPost")];
  }

  if (isConfigured && config.placement?.footer) {
    components.footerEnd = [buildComponent(config, "footer")];
  }

  return {
    name: "mailerlite-newsletter",
    version: PACKAGE_VERSION,
    description: "Newsletter signup form backed by MailerLite subscribers API.",
    enabled: isConfigured,
    order: config.order ?? 0,
    components,
  };
}
