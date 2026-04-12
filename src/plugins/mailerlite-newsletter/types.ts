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

export interface MailerLiteNewsletterFormConfig {
  actionUrl?: string;
  emailFieldName?: string;
  nameFieldName?: string;
  submitValue?: string;
  antiCsrfValue?: string;
  target?: "_blank" | "_self";
}

export interface MailerLiteNewsletterPlacementConfig {
  afterPost?: boolean;
}

export interface MailerLiteNewsletterConfig {
  enabled: boolean;
  form: MailerLiteNewsletterFormConfig;
  order?: number;
  placement?: MailerLiteNewsletterPlacementConfig;
  ui: MailerLiteNewsletterUiConfig;
}
