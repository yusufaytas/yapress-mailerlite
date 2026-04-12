import type { MailerLiteNewsletterConfig } from "@/plugins/mailerlite-newsletter/types";

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
    eyebrow: "Newsletter",
    title: "Get new essays in your inbox",
    description:
      "Subscribe for new posts on software engineering, leadership, and the social side of building systems.",
    emailPlaceholder: "you@example.com",
    namePlaceholder: "First name (optional)",
    buttonText: "Subscribe",
    successMessage: "You're in. Check your inbox if MailerLite asks you to confirm.",
    privacyNote: "No spam. Unsubscribe any time.",
  },
};
