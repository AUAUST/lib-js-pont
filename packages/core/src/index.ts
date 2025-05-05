import { Pont } from "./classes/Pont.js";

const pont = Pont.getInstance();

export { pont, Pont };

export type { ParamsSerializer, Transporter } from "./services/index.js";
export type {
  ComponentName,
  PontAppState,
  PontAppStateInit,
} from "./types/index.js";
export {
  getElement,
  getInitialState,
  getTitleTransformer,
  type NormalizedUrlParams,
  type RootElement,
} from "./utils/index.js";
