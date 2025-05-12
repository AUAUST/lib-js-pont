import { Pont } from "@core/src/classes/Pont.js";

const pont = Pont.getInstance();

export { pont, Pont };

export { Request, Service, Url, UrlParams } from "@core/src/classes/index.js";
export { type PontInit } from "@core/src/classes/Pont.js";
export { Method } from "@core/src/enums/Method.js";
export {
  HeadersManager,
  RequestsManager,
  ServicesManager,
  StateManager,
} from "@core/src/managers/index.js";
export type { VisitOptions } from "@core/src/managers/RequestsManager.js";
export {
  type ServiceInit,
  type ServiceName,
  type ServicesInit,
  type ServicesMap,
} from "@core/src/services/index.js";
export type {
  EventWithTarget,
  GlobalProps,
  LayoutName,
  LayoutProps,
  PageName,
  PageProps,
  PontAppState,
  PropsGroups,
  StateInit,
} from "@core/src/types/index.js";
export type { RootElement } from "@core/src/utils/bootstrap.js";
export type { NormalizedUrlParams } from "@core/src/utils/params.js";
