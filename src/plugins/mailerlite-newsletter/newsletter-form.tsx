'use client';

import { useEffect, useState } from "react";

import styles from "./newsletter-form.module.css";

type NewsletterFormProps = {
  layout: "footer" | "afterPost";
  title: string;
  description?: string;
  eyebrow?: string;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  buttonText?: string;
  successMessage?: string;
  privacyNote?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";
const SUBSCRIBED_STORAGE_KEY = "mailerlite-newsletter-subscribed";

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function NewsletterForm({
  layout,
  title,
  description,
  eyebrow,
  emailPlaceholder = "Email address",
  namePlaceholder = "First name (optional)",
  buttonText = "Subscribe",
  successMessage = "Thanks for subscribing.",
  privacyNote,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(SUBSCRIBED_STORAGE_KEY) === "true") {
      setIsSubscribed(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/plugins/mailerlite/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          source: layout,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setState("error");
        setMessage(payload.message ?? "Subscription failed. Please try again.");
        return;
      }

      setState("success");
      setMessage(payload.message ?? successMessage);
      window.localStorage.setItem(SUBSCRIBED_STORAGE_KEY, "true");
      setEmail("");
      setName("");
    } catch {
      setState("error");
      setMessage("Subscription failed. Please try again.");
    }
  }

  if (isSubscribed) {
    return null;
  }

  return (
    <section className={cx(styles.root, layout === "footer" ? styles.footer : styles.afterPost)}>
      <div className={styles.inner}>
        <div className={styles.content}>
          {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
          <h3 className={styles.title}>{title}</h3>
          {description ? <p className={styles.description}>{description}</p> : null}
          {privacyNote ? <p className={styles.note}>{privacyNote}</p> : null}
        </div>
        <div className={styles.formWrap}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              autoComplete="given-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={namePlaceholder}
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={emailPlaceholder}
              className={styles.input}
              required
            />
            <button
              type="submit"
              className={styles.button}
              disabled={state === "submitting"}
            >
              <svg
                className={styles.buttonIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 7.5C4 6.67157 4.67157 6 5.5 6H18.5C19.3284 6 20 6.67157 20 7.5V16.5C20 17.3284 19.3284 18 18.5 18H5.5C4.67157 18 4 17.3284 4 16.5V7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 7L12 12L19 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {state === "submitting" ? "Submitting..." : buttonText}
            </button>
          </form>
        </div>
        {message ? (
          <p
            className={cx(styles.message, state === "success" ? styles.messageSuccess : styles.messageError)}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
