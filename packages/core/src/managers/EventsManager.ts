import { Fn, s } from "@auaust/primitive-kit";
import type { Pont } from "@core/src/classes/Pont.js";
import type { Request } from "@core/src/classes/Request.js";
import type { ResponseInstance } from "@core/src/classes/Responses/Response.js";
import type { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import { Manager } from "@core/src/managers/Manager.js";
import type { RequestOptions } from "@core/src/types/requests.js";

export type EventsManagerInit = {
  onBefore?: EventListener<"before">;
  onUnhandled?: EventListener<"unhandled">;
  onSuccess?: EventListener<"success">;
  onError?: EventListener<"error">;
  onFinish?: EventListener<"finish">;
};

/**
 * The mapping of event names to their corresponding details.
 */
export type PontEventsMap = {
  before: {
    request: RequestOptions;
  };
  success: {
    request: Request;
    response: ResponseInstance;
  };
  unhandled: {
    request: Request;
    response: UnhandledResponse;
  };
  error: {
    request: Request;
    error: Error;
  };
  finish: {
    request: Request;
    response?: ResponseInstance;
  };
};

export type EventConfig = EventInit & {
  cancelable: boolean;
};

export type EventName = keyof PontEventsMap;

export type EventDetails<T extends EventName> = PontEventsMap[T] & {
  pont: Pont;
};

export type PontEvent<T extends EventName = EventName> = CustomEvent<
  EventDetails<T>
>;

export type EventListener<T extends EventName = EventName> = (
  this: Pont,
  event: PontEvent<T>
) => void | false;

/**
 * The EventsManager class is responsible for storing and dispatching events.
 */
export class EventsManager extends Manager {
  protected readonly config: Record<EventName, EventConfig> = {
    before: {
      cancelable: true,
    },
    unhandled: {
      cancelable: true,
    },
    success: {
      cancelable: false,
    },
    error: {
      cancelable: false,
    },
    finish: {
      cancelable: false,
    },
  };

  protected readonly listeners: { [K in EventName]?: Set<EventListener<K>> } =
    {};

  public init({
    onBefore,
    onUnhandled,
    onSuccess,
    onError,
    onFinish,
  }: EventsManagerInit = {}): this {
    onBefore && this.onBefore(onBefore);
    onUnhandled && this.onUnhandled(onUnhandled);
    onSuccess && this.onSuccess(onSuccess);
    onError && this.onError(onError);
    onFinish && this.onFinish(onFinish);

    return this;
  }

  protected getEventConfig<T extends EventName>(name: T): EventConfig {
    return this.config[name];
  }

  protected getListeners<T extends EventName>(name: T): Set<EventListener<T>> {
    return this.listeners[name]!;
  }

  public on<T extends EventName>(name: T, listener: EventListener<T>) {
    if (!this.listeners[name]) {
      // @ts-expect-error
      this.listeners[name] = new Set();
    }

    this.listeners[name].add(listener);

    return () => this.off(name, listener);
  }

  public once<T extends EventName>(name: T, listener: EventListener<T>) {
    const wrappedListener = (event: PontEvent<T>) => (
      this.off(name, wrappedListener), listener.call(this.pont, event)
    );

    this.on(name, wrappedListener);

    return () => this.off(name, wrappedListener);
  }

  public onBefore(listener: EventListener<"before">) {
    return this.on("before", listener);
  }

  public onUnhandled(listener: EventListener<"unhandled">) {
    return this.on("unhandled", listener);
  }

  public onSuccess(listener: EventListener<"success">) {
    return this.on("success", listener);
  }

  public onError(listener: EventListener<"error">) {
    return this.on("error", listener);
  }

  public onFinish(listener: EventListener<"finish">) {
    return this.on("finish", listener);
  }

  protected off(name: EventName, listener: Fn): boolean {
    return this.getListeners(name)?.delete(listener);
  }

  public emit<T extends EventName>(name: T, detail: EventDetails<T>): void {
    const event = this.createEvent(name, detail);

    this.dispatchEvent(name, event);
  }

  protected dispatchEvent<T extends EventName>(
    name: T,
    event: PontEvent<T>
  ): void {
    const shouldDispatch = this.callListeners(name, event);

    if (shouldDispatch && typeof window !== "undefined") {
      window.dispatchEvent(event);
    }
  }

  protected callListeners<T extends EventName>(
    name: T,
    event: PontEvent<T>
  ): boolean {
    const config = this.getEventConfig(name);

    for (const listener of this.getListeners(name)) {
      const result = listener.call(this.pont, event);

      if (config.cancelable && result === false) {
        event.preventDefault();
      }

      if (event.defaultPrevented) {
        return false;
      }
    }

    return true;
  }

  protected createEvent<T extends EventName>(
    name: T,
    detail: EventDetails<T>
  ): PontEvent<T> {
    return new CustomEvent(s(name).lower().ensureStart("pont:").toString(), {
      ...this.getEventConfig(name),
      detail: { ...detail, pont: this.pont },
    });
  }
}
