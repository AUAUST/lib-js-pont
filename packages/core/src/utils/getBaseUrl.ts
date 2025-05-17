import { s, S } from "@auaust/primitive-kit";

/**
 * Retrieves the base URL for the application.
 */
export function getBaseUrl(url: string | undefined): string | undefined {
  if (typeof window === "undefined") {
    if (S.is(url) && URL.canParse(url)) {
      return new URL(url).origin;
    }

    return;
  }

  if (S.isStrict(url)) {
    // If the URL does not start with a protocol, prepend the current protocol.
    // This allows users to specify a simple domain name without a protocol,
    // like "example.com", and it will be treated as "http://example.com".
    if (s(url).before("://").includes("http").not().toBoolean()) {
      url = s(url)
        .after("://")
        .or(url)
        .prepend(window.location.protocol, "//")
        .toString();
    }
  }

  try {
    if (S.isStrict(url)) {
      return new URL(url, window.location.origin).origin;
    }
  } catch (e) {
    // ...
  }
}
