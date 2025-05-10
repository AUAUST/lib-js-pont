import { Pont } from "./classes/Pont.js";

const pont = Pont.getInstance();

export { pont, Pont };

export { Request, Service, Url, UrlParams } from "./classes/index.js";
export type { ParamsSerializer, Transporter } from "./services/index.js";
export type { ComponentName, PontAppState, StateInit } from "./types/index.js";
export type { RootElement } from "./utils/bootstrap.js";
export type { NormalizedUrlParams } from "./utils/params.js";
