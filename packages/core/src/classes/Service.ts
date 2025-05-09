import type {
  ServiceInstance,
  ServiceName,
  ServiceParameters,
  ServiceReturnType,
} from "src/services/index.js";
import type { Pont } from "./Pont.js";

export abstract class Service<T extends ServiceName = ServiceName>
  implements ServiceInstance<T>
{
  public constructor(public readonly pont: Pont) {}

  public abstract handle(...args: ServiceParameters<T>): ServiceReturnType<T>;
}
