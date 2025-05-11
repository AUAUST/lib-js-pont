import { F, O } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import {
  ServiceConstructorMarker,
  ServiceInstanceMarker,
} from "src/classes/Service.js";
import {
  ParamsSerializerService,
  PropsReconcilerService,
  ResponseHandlerService,
  TransporterService,
  type ParamsSerializerSignature,
  type PropsReconcilerSignature,
  type ResolvedService,
  type ResponseHandlerSignature,
  type ServiceClass,
  type ServiceFunction,
  type ServiceInit,
  type ServiceInstance,
  type ServiceObject,
  type ServiceParameters,
  type ServiceReturnType,
  type ServicesInit,
  type TitleTransformerSignature,
  type TransporterSignature,
} from "src/services/index.js";

export type ServicesManagerInit = {
  services?: ServicesInit;
};

export type ServicesMap = {
  paramsSerializer: ParamsSerializerSignature;
  propsReconciler: PropsReconcilerSignature;
  responseHandler: ResponseHandlerSignature;
  titleTransformer: TitleTransformerSignature;
  transporter: TransporterSignature;
};

export type ServiceName = keyof ServicesMap;

export type ServiceHandlerTypesMap<T extends ServiceName = ServiceName> = {
  constructor: ServiceClass<T>;
  instance: ServiceInstance<T>;
  function: ServiceFunction<T>;
  object: ServiceObject<T>;
};

export type ServiceHandlerType = keyof ServiceHandlerTypesMap;

/**
 * The state manager holds the state of the app, including the URL, page name, layout name, props, and other data.
 */
export class ServicesManager {
  protected services: { [K in ServiceName]: ResolvedService<K> } = <any>{};
  protected servicesTypes: Record<ServiceName, ServiceHandlerType> = <any>{};

  public constructor(public readonly pont: Pont) {}

  public init({ services }: ServicesManagerInit = {}): this {
    this.registerServices(services, [
      ["paramsSerializer", (pont) => new ParamsSerializerService(pont)],
      ["propsReconciler", (pont) => new PropsReconcilerService(pont)],
      ["responseHandler", ResponseHandlerService],
      ["titleTransformer", () => F.identity],
      ["transporter", (pont) => new TransporterService(pont)],
    ]);

    return this;
  }

  protected registerServices(
    services: ServicesInit | undefined,
    config: { [K in ServiceName]: [K, ServiceInit<K>] }[ServiceName][]
  ): this {
    for (const [name, defaultService] of config) {
      this.registerService(name, services?.[name] || defaultService);
    }

    return this;
  }

  protected registerService<T extends ServiceName>(
    name: T,
    init: ServiceInit<T>
  ): this {
    if (this.services[name]) {
      throw new Error(`Service ${name} already exists`);
    }

    if (F.isConstructible(init) && ServiceConstructorMarker in init) {
      return this.registerServiceConstructor(name, init);
    }

    let service: ResolvedService<T>;

    if (F.is(init)) {
      service = init(this.pont);
    } else {
      service = init;
    }

    if (ServiceInstanceMarker in service) {
      // @ts-expect-error - TS can't infer that ServiceInstanceMarker implies a ServiceInstance
      return this.registerServiceInstance(name, service);
    }

    if (F.is(service)) {
      return this.registerServiceFunction(name, service);
    }

    if (O.is(service)) {
      if (!F.is(service.handle)) {
        throw new Error(
          `Service ${name} is not a valid service. It must have a handle method.`
        );
      }

      // @ts-expect-error - TS isn't able to narrow down the type to solely ServiceObject
      return this.registerServiceObject(name, service);
    }

    throw new Error(`Service ${name} is not a valid service`);
  }

  protected registerServiceAs<
    N extends ServiceName,
    T extends ServiceHandlerType
  >(type: T, name: N, service: ServiceHandlerTypesMap<N>[T]): this {
    this.servicesTypes[name] = type;
    // @ts-expect-error – TS isn't able properly narrow down the type
    this.services[name] = service;

    return this;
  }

  protected registerServiceConstructor<T extends ServiceName>(
    name: T,
    service: ServiceClass<T>
  ): this {
    return this.registerServiceAs("constructor", name, service);
  }

  protected registerServiceInstance<T extends ServiceName>(
    name: T,
    service: ServiceInstance<T>
  ): this {
    return this.registerServiceAs("instance", name, service);
  }

  protected registerServiceFunction<T extends ServiceName>(
    name: T,
    service: ServiceFunction<T>
  ): this {
    return this.registerServiceAs("function", name, service);
  }

  protected registerServiceObject<T extends ServiceName>(
    name: T,
    service: ServiceObject<T>
  ): this {
    return this.registerServiceAs("object", name, service);
  }

  public getService<
    N extends ServiceName,
    T extends ServiceHandlerType = ServiceHandlerType
  >(name: N): ServiceHandlerTypesMap<N>[T] {
    const service = this.services[name];

    if (!service) {
      throw new Error(`Service ${name} does not exist`);
    }

    // @ts-expect-error
    return service;
  }

  protected getServiceType<T extends ServiceName>(name: T) {
    const type = this.servicesTypes[name];

    if (!type) {
      throw new Error(`Service ${name} does not exist`);
    }

    return type;
  }

  /**
   * Calls the specified service with the given arguments.
   */
  public use<T extends ServiceName>(
    serviceName: T,
    ...args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const type = this.getServiceType(serviceName);

    switch (type) {
      case "constructor":
        return this.handleWithConstructor(serviceName, args);
      case "instance":
        return this.handleWithInstance(serviceName, args);
      case "function":
        return this.handleWithFunction(serviceName, args);
      case "object":
        return this.handleWithObject(serviceName, args);
      default:
        throw new Error(`Service ${serviceName} is not a valid service`);
    }
  }

  /**
   * If the service is a constructor, it will be instantiated
   * for each call with Pont and its handle method will be called.
   */
  protected handleWithConstructor<T extends ServiceName>(
    serviceName: T,
    args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const service = this.getService<T, "constructor">(serviceName);
    const instance = new service(this.pont);

    return instance.handle(...args);
  }

  /**
   * If the service is a service instance, its handle method will
   * be called without instanciating it again.
   */
  protected handleWithInstance<T extends ServiceName>(
    serviceName: T,
    args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const service = this.getService<T, "instance">(serviceName);

    return service.handle(...args);
  }

  /**
   * If the service is a function, it will be called with Pont
   * as `this` and the given arguments.
   */
  protected handleWithFunction<T extends ServiceName>(
    serviceName: T,
    args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const service = this.getService<T, "function">(serviceName);

    return service.apply(this.pont, args);
  }

  /**
   * If the service is an object, its handle method will be called
   * with Pont as the first argument and the given arguments.
   */
  protected handleWithObject<T extends ServiceName>(
    serviceName: T,
    args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const service = this.getService<T, "object">(serviceName);

    return service.handle.call(service, this.pont, ...args);
  }
}
