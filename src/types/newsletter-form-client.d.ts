declare module "@yusufaytas/yapress-mailerlite/newsletter-form-client" {
  import type { ComponentType } from "react";
  import type { NewsletterFormProps } from "../plugins/mailerlite-newsletter/newsletter-form";

  const NewsletterFormClient: ComponentType<NewsletterFormProps>;
  export default NewsletterFormClient;
}
