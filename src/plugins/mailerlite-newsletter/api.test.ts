import { describe, expect, it } from "vitest";

import { validateSubscribePayload } from "./api";

describe("validateSubscribePayload", () => {
  it("normalizes a valid payload", () => {
    const result = validateSubscribePayload({
      email: " Yusuf@Example.com ",
      name: " Yusuf ",
    });

    expect(result).toEqual({
      ok: true,
      email: "yusuf@example.com",
      name: "Yusuf",
    });
  });

  it("rejects malformed email addresses", () => {
    const result = validateSubscribePayload({
      email: "not-an-email",
    });

    expect(result).toEqual({
      ok: false,
      message: "Enter a valid email address.",
    });
  });

  it("rejects names longer than 120 characters", () => {
    const result = validateSubscribePayload({
      email: "yusuf@example.com",
      name: "a".repeat(121),
    });

    expect(result).toEqual({
      ok: false,
      message: "Name is too long.",
    });
  });
});
