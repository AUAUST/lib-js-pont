import type { Pont } from "@core/src/classes/Pont.js";
import type {
  ServiceInstance,
  ServiceName,
  ServiceParameters,
  ServiceReturnType,
} from "@core/src/services/index.js";

export const ServiceConstructorMarker = Symbol.for("Pont.ServiceConstructor");
export const ServiceInstanceMarker = Symbol.for("Pont.ServiceInstance");

export abstract class Service<T extends ServiceName = ServiceName>
  implements ServiceInstance<T>
{
  /**
   * Used to check if a class is a service constructor.
   * This is a workaround for `instanceof` sometimes not working with
   * ESM modules (same classes might actually be different objects/references).
   *
   * @internal
   */
  public static readonly [ServiceConstructorMarker] = true;

  /**
   * Used to check if an object is a service instance.
   * This is a workaround for `instanceof` sometimes not working with
   * ESM modules (same classes might actually be different objects/references).
   *
   * @internal
   */
  public readonly [ServiceInstanceMarker] = true;

  public constructor(public readonly pont: Pont) {}

  public abstract handle(...args: ServiceParameters<T>): ServiceReturnType<T>;
}
