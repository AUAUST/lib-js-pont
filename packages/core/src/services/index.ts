import type { Pont } from "src/classes/Pont.js";

export {
  createDefaultParamsSerializer,
  type ParamsSerializer,
} from "./ParamsSerializer.js";
export { createDefaultTransporter, type Transporter } from "./Transporter.js";

export type ServiceName = keyof Pont["services"];

export type ServicesMap = {
  [K in ServiceName]: NonNullable<Pont["services"][K]>;
};

export type PartialServicesMap = Partial<ServicesMap>;
