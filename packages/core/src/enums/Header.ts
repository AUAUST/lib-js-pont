/**
 * The Header enum defines the Pont header names.
 */
export enum Header {
  /**
   * Indicates that the request is a Pont request.
   * Sent to the server, it is set to the library version.
   * Received from the server, it is set to `1` or `true`.
   */
  PONT = "x-pont",

  /**
   * Indicates the type of the request or response.
   * Its value is one of the `ExchangeMode` enum values.
   */
  MODE = "x-pont-mode",
}
