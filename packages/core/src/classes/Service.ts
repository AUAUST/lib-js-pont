import type {
  ServiceInstance,
  ServiceName,
  ServiceParameters,
  ServiceReturnType,
} from "src/services/index.js";
import type { Pont } from "./Pont.js";

export const ServiceMarker = Symbol.for("Pont.Service");

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
  public static readonly [ServiceMarker] = true;

  public constructor(public readonly pont: Pont) {}

  public abstract handle(...args: ServiceParameters<T>): ServiceReturnType<T>;
}
