import type { Pont } from "src/classes/Pont.js";
import type { ServiceName, ServicesMap } from "src/managers/ServicesManager.js";

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

export type ServicesInit = {
  [K in ServiceName]?: ServiceInit<K>;
};

export type ServiceInit<N extends ServiceName = ServiceName> =
  | ServiceClass<N>
  | ServiceInstance<N>
  | ServiceObject<N>
  | ((pont: Pont) => ServiceInstance<N>)
  | ((pont: Pont) => ServiceObject<N>)
  // Factory functions can't be distinguished from service functions
  // thus a ServiceFunction is required to be returned by another function.
  | ((pont: Pont) => ServiceFunction<N>);

export type ResolvedService<N extends ServiceName = ServiceName> =
  | ServiceClass<N>
  | ServiceInstance<N>
  | ServiceObject<N>
  | ServiceFunction<N>;

export type ServiceSignature<T extends ServiceName = ServiceName> =
  ServicesMap[T];

export type ServiceParameters<T extends ServiceName> = Parameters<
  ServiceSignature<T>
>;

export type ServiceReturnType<T extends ServiceName> = ReturnType<
  ServiceSignature<T>
>;

export type { ServiceName, ServicesMap };

export {
  ParamsSerializerService,
  type ParamsSerializerSignature,
} from "./ParamsSerializer.js";
export {
  PropsReconcilerService,
  type PropsReconcilerSignature,
} from "./PropsReconciler.js";
export {
  ResponseHandlerService,
  type ResponseHandlerSignature,
} from "./ResponseHandler.js";
export type { TitleTransformerSignature } from "./TitleTransformer.js";
export {
  TransporterService,
  type TransporterSignature,
} from "./Transporter.js";
