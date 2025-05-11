import { s, S } from "@auaust/primitive-kit";

/**
 * Retrieves the base URL for the application.
 */
export function getBaseUrl(url: string | undefined): string {
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

  return new URL(url || "", window.location.origin).origin;
}
