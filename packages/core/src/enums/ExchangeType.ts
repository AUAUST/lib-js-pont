import { enumValidator } from "@core/src/enums/index.js";

/**
 * The possible kind of data exchanged between the client and the server.
 * Whether it is a request for data or a navigation request.
 * Used to set the `x-pont-type` header.
 */
export enum ExchangeType {
  DATA = "data",
  NAVIGATION = "navigation",
}

export const isExchangeType = enumValidator(ExchangeType);
