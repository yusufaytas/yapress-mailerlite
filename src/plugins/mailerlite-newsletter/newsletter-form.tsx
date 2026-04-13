'use client';

import { useEffect, useState, type KeyboardEvent } from "react";

export type NewsletterFormProps = {
  formActionUrl: string;
  emailFieldName?: string;
  nameFieldName?: string;
  submitValue?: string;
  antiCsrfValue?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  emailPlaceholder?: string;
  namePlaceholder?: string;
  buttonText?: string;
  privacyNote?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";
const SUBSCRIBED_STORAGE_KEY = "mailerlite-newsletter-subscribed";

export function NewsletterForm({
  formActionUrl,
  emailFieldName = "fields[email]",
  nameFieldName,
  submitValue = "1",
  antiCsrfValue = "true",
  title,
  description,
  eyebrow,
  emailPlaceholder = "Email address",
  namePlaceholder = "First name (optional)",
  buttonText = "Subscribe",
  privacyNote,
}: NewsletterFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(SUBSCRIBED_STORAGE_KEY) === "true") {
      setIsSubscribed(true);
    }
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || state === "submitting") {
      return;
    }

    event.preventDefault();
    void handleSubmit();
  }

  async function handleSubmit() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setState("error");
      setMessage("Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.set(emailFieldName, trimmedEmail);
    formData.set("ml-submit", submitValue);
    formData.set("anticsrf", antiCsrfValue);

    if (nameFieldName && name.trim()) {
      formData.set(nameFieldName, name.trim());
    }

    setState("submitting");
    setMessage("");

    try {
      await fetch(formActionUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      setState("success");
      setMessage("");
      window.localStorage.setItem(SUBSCRIBED_STORAGE_KEY, "true");
    } catch {
      setState("error");
      setMessage("Subscription failed. Please try again.");
    }
  }

  if (isSubscribed) {
    return null;
  }

  const isFormDisabled = state === "success" || state === "submitting";
  const buttonLabel =
    state === "submitting" ? "Submitting..." : state === "success" ? "Submitted" : buttonText;
  const statusColor = state === "error" ? "var(--danger, #b42318)" : "var(--muted)";
  const isSuccess = state === "success";

  return (
    <section className="footer-plugin-separator">
      <div className="article-meta-grid">
        <div className="article-meta-group">
          <div className="article-taxonomy-label">{eyebrow || "Newsletter"}</div>
          <div>{title}</div>
          {description ? <div>{description}</div> : null}
          {privacyNote ? <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{privacyNote}</div> : null}
        </div>
        <div className="article-meta-group">
          <div role="form" aria-busy={state === "submitting"}>
            {nameFieldName ? (
              <input
                type="text"
                name={nameFieldName}
                autoComplete="given-name"
                placeholder={namePlaceholder}
                style={{ display: 'block', width: '100%', padding: '0.65rem 0.75rem', marginBottom: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isFormDisabled}
              />
            ) : null}
            <input
              type="email"
              name={emailFieldName}
              autoComplete="email"
              placeholder={emailPlaceholder}
              style={{ display: 'block', width: '100%', padding: '0.65rem 0.75rem', marginBottom: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isFormDisabled}
            />
            <button
              type="button"
              className="social-share__button"
              style={{
                width: '100%',
                justifyContent: 'center',
                gap: '0.55rem',
                opacity: isSuccess ? 1 : undefined,
                background: isSuccess ? 'var(--text)' : undefined,
                color: isSuccess ? 'var(--background, var(--surface))' : undefined,
                borderColor: isSuccess ? 'var(--text)' : undefined,
              }}
              disabled={isFormDisabled}
              onClick={handleSubmit}
              aria-live="polite"
            >
              {state === "submitting" ? (
                <span
                  aria-hidden="true"
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '999px',
                    border: '2px solid currentColor',
                    borderRightColor: 'transparent',
                    display: 'inline-block',
                    animation: 'mailerlite-newsletter-spin 0.8s linear infinite',
                  }}
                />
              ) : state === "success" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-1.99-2-1.99zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                </svg>
              )}
              <span>{buttonLabel}</span>
            </button>
            <style>{`@keyframes mailerlite-newsletter-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          {message && state !== "success" ? (
            <p role="status" aria-live="polite" style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: statusColor }}>
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
