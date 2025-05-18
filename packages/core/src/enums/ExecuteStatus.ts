import { enumValidator } from "@core/src/enums/index.js";

/**
 * The status of a request execution once settled.
 */
export enum ExecuteStatus {
  CANCELED = "canceled",
  FAILED = "failed",
  SUCCESS = "success",
}

export const isExecuteStatus = enumValidator(ExecuteStatus);
