import type { Pont } from "src/classes/Pont.js";

export interface Service {
  /**
   * Handles the service's logic.
   */
  handle(this: Service, pont: Pont, ...args: unknown[]): unknown;
}

export type ServiceName = keyof Pont["services"];

export type ServicesMap = {
  [K in ServiceName]: NonNullable<Pont["services"][K]>;
};

export type PartialServicesMap = Partial<ServicesMap>;

export type ServiceHandler<T extends ServiceName = ServiceName> =
  ServicesMap[T]["handle"];

export type ServiceParameters<T extends ServiceName> = Parameters<
  ServiceHandler<T>
> extends [Pont, ...infer U]
  ? U
  : never;

export type ServiceReturnType<T extends ServiceName> = ReturnType<
  ServiceHandler<T>
>;

export {
  createDefaultParamsSerializer,
  type ParamsSerializer,
} from "./ParamsSerializer.js";
export {
  createDefaultResponseHandler,
  type ResponseHandler,
} from "./ResponseHandler.js";
export { createDefaultTransporter, type Transporter } from "./Transporter.js";
