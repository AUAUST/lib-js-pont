import { F, type Fn, O, S, s } from "@auaust/primitive-kit";
import type { Pont } from "@core/src/classes/Pont.js";
import type { Request } from "@core/src/classes/Request.js";
import type { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import type { ResponseInstance } from "@core/src/classes/Responses/Response.js";
import type { UnhandledResponse } from "@core/src/classes/Responses/UnhandledResponse.js";
import { Manager } from "@core/src/managers/Manager.js";
import type { ErrorBag } from "@core/src/types/errors.js";

export type EventListeners = {
  [K in EventName as `on${Capitalize<K>}`]?: EventListener<K>;
};

export type EventsManagerInit = {
  listeners?: EventListeners;
};

/**
 * The mapping of event names to their corresponding details.
 */
export type PontEventsMap = {
  before: {
    request: Request;
  };
  prevented: {
    request: Request;
  };
  start: {
    request: Request;
  };
  received: {
    request: Request;
    rawResponse: RawResponse;
  };
  success: {
    request: Request;
    response: ResponseInstance;
  };
  unhandled: {
    request: Request;
    response: UnhandledResponse;
  };
  exception: {
    request: Request;
    error: Error;
  };
  error: {
    request: Request;
    response: ResponseInstance;
    errors?: ErrorBag;
  };
  finish: {
    request: Request;
    response?: ResponseInstance;
  };
  invalid: {
    request: Request;
    response: ResponseInstance;
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
) => unknown | false;

export type EventRegistrars = {
  [K in EventName as `on${Capitalize<K>}`]: (
    listener: EventListener<K>
  ) => () => void;
};

export interface EventsManager extends EventRegistrars {}

/**
 * The EventsManager class is responsible for storing and dispatching events.
 */
export class EventsManager extends Manager {
  protected static readonly config: Record<EventName, EventConfig> = {
    before: {
      cancelable: true,
    },
    prevented: {
      cancelable: false,
    },
    start: {
      cancelable: false,
    },
    received: {
      cancelable: false,
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
    exception: {
      cancelable: false,
    },
    invalid: {
      cancelable: false,
    },
  };

  static {
    for (const name of O.keys(this.config)) {
      // @ts-expect-error
      this.prototype[`on${S.capitalize(name)}`] = function (
        listener: EventListener
      ) {
        return this.on(name, listener);
      };
    }
  }

  protected readonly listeners: { [K in EventName]?: Set<EventListener<K>> } =
    {};

  public init(init: EventsManagerInit = {}): this {
    if (init.listeners) {
      for (const [name, listener] of Object.entries(init.listeners)) {
        if (!listener) {
          continue;
        }

        const event = s(name).afterStart("on").decapitalize().toString();

        if (event && this.eventExists(event)) {
          this.on(event, listener as EventListener<typeof event>);
        }
      }
    }

    return this;
  }

  public eventExists(name: string): name is EventName {
    return name in EventsManager.config;
  }

  public getEventNames(): EventName[] {
    return Object.keys(EventsManager.config) as EventName[];
  }

  protected getEventConfig<T extends EventName>(name: T): EventConfig {
    return EventsManager.config[name];
  }

  protected getListeners<T extends EventName>(name: T): Set<EventListener<T>> {
    return this.listeners[name]!;
  }

  public on<T extends EventName>(name: T, listener: EventListener<T>) {
    if (!this.eventExists(name)) {
      throw new Error(`Event "${name}" does not exist.`);
    }

    if (!F.is(listener)) {
      throw new Error(`Listener for event "${name}" is not a function.`);
    }

    // @ts-expect-error
    (this.listeners[name] ??= new Set()).add(listener);

    return () => this.off(name, listener);
  }

  public once<T extends EventName>(name: T, listener: EventListener<T>) {
    const wrappedListener = (event: PontEvent<T>) => (
      this.off(name, wrappedListener), listener.call(this.pont, event)
    );

    this.on(name, wrappedListener);

    return () => this.off(name, wrappedListener);
  }

  protected off(name: EventName, listener: Fn): boolean {
    return this.getListeners(name)?.delete(listener);
  }

  public emit<T extends EventName>(
    name: T,
    detail: Omit<EventDetails<T>, "pont">
  ): { event: PontEvent<T>; canceled: boolean } {
    const event = this.createEvent(name, detail);
    const canceled = this.dispatchEvent(name, event);

    return { event, canceled };
  }

  protected dispatchEvent<T extends EventName>(
    name: T,
    event: PontEvent<T>
  ): boolean {
    const shouldDispatch = this.callInternalListeners(name, event);

    if (!shouldDispatch) {
      return true;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(event);
    }

    return !!event.defaultPrevented;
  }

  protected callInternalListeners<T extends EventName>(
    name: T,
    event: PontEvent<T>
  ): boolean {
    const listeners = this.getListeners(name);

    if (!listeners) {
      return true;
    }

    const { cancelable } = this.getEventConfig(name);

    for (const listener of listeners) {
      const result = listener.call(this.pont, event);

      if (cancelable && result === false) {
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
    detail: Omit<EventDetails<T>, "pont">
  ): PontEvent<T> {
    return new CustomEvent(s(name).lower().ensureStart("pont:").toString(), {
      ...this.getEventConfig(name),
      detail: {
        ...(detail as EventDetails<T>),
        pont: this.pont,
      },
    });
  }
}
