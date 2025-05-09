import type { Pont } from "src/classes/Pont.js";

export interface ServiceObject<N extends ServiceName = ServiceName> {
  /**
   * Handles the service's logic.
   */
  handle(
    this: ServiceObject<N>,
    pont: Pont,
    ...args: ServiceParameters<N>
  ): ServiceReturnType<N>;

  // Allows for additional properties to be added to the
  // service object without TypeScript complaining.
  [key: string]: unknown;
}

export interface ServiceClass<N extends ServiceName = ServiceName> {
  new (pont: Pont): ServiceInstance<N>;
}

export interface ServiceInstance<N extends ServiceName = ServiceName> {
  handle(...args: ServiceParameters<N>): ServiceReturnType<N>;
}

export interface ServiceFunction<N extends ServiceName = ServiceName> {
  (this: Pont, ...args: ServiceParameters<N>): ServiceReturnType<N>;
}

export type ServiceInit<N extends ServiceName = ServiceName> =
  | ServiceObject<N>
  | ServiceClass<N>
  | ServiceInstance<N>
  | ((pont: Pont) => ServiceObject<N>)
  | ((pont: Pont) => ServiceClass<N>)
  | ((pont: Pont) => ServiceInstance<N>)
  // Factory functions can't be distinguished from service functions
  // thus a ServiceFunction is required to be returned by another function.
  | ((pont: Pont) => ServiceFunction<N>);

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
  ParamsSerializerService,
  type ParamsSerializer,
} from "./ParamsSerializer.js";
export {
  createDefaultPropsReconciler,
  type PropsReconciler,
} from "./PropsReconciler.js";
export {
  createDefaultResponseHandler,
  type ResponseHandler,
} from "./ResponseHandler.js";
export { createDefaultTransporter, type Transporter } from "./Transporter.js";
export {
  createDefaultUnhandledResponseHandler,
  type UnhandledResponseHandler,
} from "./UnhandledResponseHandler.js";
