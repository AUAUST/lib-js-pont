import type { ComponentName } from "./utils.js";

export type ResponseType = "visit" | "fragment" | "empty" | "data";

export interface Response<T extends ResponseType = ResponseType> {
  /** The response type. */
  type: T;
}

export interface VisitResponse extends Response<"visit"> {
  /** The component name to render. */
  component: ComponentName;
  /** The new URL that the browser should display. */
  url: string;
  /** The page props to pass to the component. */
  props: Record<string, unknown>;
}

export interface FragmentResponse extends Response<"fragment"> {
  /** The component name this response is intended for. */
  intendedComponent: ComponentName;
  /** The partial page props to update the frontend state. */
  props: Record<string, unknown>;
}

export interface EmptyResponse extends Response<"empty"> {}

export interface DataResponse<T = unknown> extends Response<"data"> {
  /** The raw data to be sent to the client. */
  data: T;
}
