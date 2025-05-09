import { F, O } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { Service } from "src/classes/Service.js";
import {
  createDefaultPropsReconciler,
  createDefaultResponseHandler,
  createDefaultTransporter,
  createDefaultUnhandledResponseHandler,
  ParamsSerializerService,
  type ParamsSerializer,
  type PropsReconciler,
  type ResolvedService,
  type ResponseHandler,
  type ServiceClass,
  type ServiceFunction,
  type ServiceInit,
  type ServiceInstance,
  type ServiceObject,
  type ServiceParameters,
  type ServiceReturnType,
  type ServicesInit,
  type Transporter,
  type UnhandledResponseHandler,
} from "src/services/index.js";

export type ServicesManagerInit = {
  services?: ServicesInit;
};

export type ServicesMap = {
  paramsSerializer: ParamsSerializer;
  propsReconciler: PropsReconciler;
  responseHandler: ResponseHandler;
  transporter: Transporter;
  unhandledResponseHandler: UnhandledResponseHandler;
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
 * The state manager holds the state of the app, including the URL, component name, props, and other data.
 */
export class ServicesManager {
  protected services!: {
    [K in ServiceName]: ResolvedService<K>;
  };
  protected servicesTypes!: Record<ServiceName, ServiceHandlerType>;

  public constructor(public readonly pont: Pont) {}

  public init({ services }: ServicesManagerInit = {}): this {
    this.registerServices(services, [
      ["paramsSerializer", (pont) => new ParamsSerializerService(pont)],
      ["propsReconciler", createDefaultPropsReconciler],
      ["responseHandler", createDefaultResponseHandler],
      ["transporter", createDefaultTransporter],
      ["unhandledResponseHandler", createDefaultUnhandledResponseHandler],
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

    let service: ResolvedService<T>;

    // If the service init is a function, is might either be
    // a Service class constructor or a factory function.
    if (F.is(init)) {
      // If the function is a constructor that instanciates
      // a Service, we store it as a constructor.
      if (F.isConstructible(init) && init.prototype instanceof Service) {
        return this.registerServiceConstructor(name, init);
      }

      // Otherwise, we consider it a factory function.
      service = init(this.pont);
    } else {
      service = init;
    }

    if (service instanceof Service) {
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

  protected registerServiceConstructor<T extends ServiceName>(
    name: T,
    service: ServiceClass<T>
  ): this {
    this.servicesTypes[name] = "constructor";
    this.services[name] = service;

    return this;
  }

  protected registerServiceInstance<T extends ServiceName>(
    name: T,
    service: ServiceInstance<T>
  ): this {
    this.servicesTypes[name] = "instance";
    this.services[name] = service;

    return this;
  }

  protected registerServiceFunction<T extends ServiceName>(
    name: T,
    service: ServiceFunction<T>
  ): this {
    this.servicesTypes[name] = "function";
    this.services[name] = service;

    return this;
  }

  protected registerServiceObject<T extends ServiceName>(
    name: T,
    service: ServiceObject<T>
  ): this {
    this.servicesTypes[name] = "object";
    this.services[name] = service;

    return this;
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

    if (type === "constructor") {
      return this.useConstructor(serviceName, args);
    }

    if (type === "instance") {
      return this.useInstance(serviceName, args);
    }

    if (type === "function") {
      return this.useFunction(serviceName, args);
    }

    if (type === "object") {
      return this.useObject(serviceName, args);
    }

    throw new Error(`Service ${serviceName} is not a valid service`);
  }

  /**
   * If the service is a constructor, it will be instantiated
   * for each call with Pont and its handle method will be called.
   */
  protected useConstructor<T extends ServiceName>(
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
  protected useInstance<T extends ServiceName>(
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
  protected useFunction<T extends ServiceName>(
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
  protected useObject<T extends ServiceName>(
    serviceName: T,
    args: ServiceParameters<T>
  ): ServiceReturnType<T> {
    const service = this.getService<T, "object">(serviceName);

    return service.handle.call(service, this.pont, ...args);
  }
}
