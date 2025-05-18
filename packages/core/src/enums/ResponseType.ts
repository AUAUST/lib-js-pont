/**
 * The possible types of responses received by the server.
 * Unhandled responses are a special case set by the response handler,
 * when the response sent by the server cannot be handled by the app.
 */
export enum ResponseType {
  VISIT = "visit",
  PARTIAL = "partial",
  EMPTY = "empty",
  UNHANDLED = "unhandled",
}
