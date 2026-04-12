export interface MailerLiteNewsletterUiConfig {
  eyebrow?: string;
  title: string;
  description?: string;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  buttonText?: string;
  successMessage?: string;
  privacyNote?: string;
}

export interface MailerLiteNewsletterPlacementConfig {
  footer?: boolean;
  afterPost?: boolean;
}

export interface MailerLiteNewsletterConfig {
  enabled: boolean;
  apiToken?: string;
  groupId?: string;
  order?: number;
  placement?: MailerLiteNewsletterPlacementConfig;
  ui: MailerLiteNewsletterUiConfig;
}
