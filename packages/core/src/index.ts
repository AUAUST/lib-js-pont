export default "@auaust/pont-core";

export type {
  PontAppState,
  PontAppStateInit as PontAppStateInitializer,
} from "./types/app.js";
export type { ComponentName, Url } from "./types/index.js";
export {
  getElement,
  getInitialState,
  type RootElement,
} from "./utils/bootstrap.js";
export { getTitleTransformer } from "./utils/title.js";

export { pont } from "./classes/Pont.js";
