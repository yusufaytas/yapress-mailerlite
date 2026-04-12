import type { Plugin } from "../../types/plugin";
import { PACKAGE_VERSION } from "../../version";
import type { MailerLiteNewsletterConfig } from "./types";
import { NewsletterForm } from "./newsletter-form";

function buildComponent(config: MailerLiteNewsletterConfig) {
  return function MailerLiteNewsletterPluginComponent() {
    return (
      <NewsletterForm
        formActionUrl={config.form.actionUrl!}
        emailFieldName={config.form.emailFieldName}
        nameFieldName={config.form.nameFieldName}
        submitValue={config.form.submitValue}
        antiCsrfValue={config.form.antiCsrfValue}
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
  const isConfigured = Boolean(config.enabled && config.form.actionUrl);
  const components: Plugin["components"] = {};

  if (isConfigured && config.placement?.afterPost) {
    components.afterPost = [buildComponent(config)];
  }

  return {
    name: "mailerlite-newsletter",
    version: PACKAGE_VERSION,
    description: "Newsletter signup form backed by a MailerLite hosted form.",
    enabled: isConfigured,
    order: config.order ?? 0,
    components,
  };
}
