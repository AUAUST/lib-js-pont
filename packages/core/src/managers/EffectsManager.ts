import { A, F, O, S } from "@auaust/primitive-kit";
import type { Pont } from "@core/src/classes/Pont.js";
import { Manager } from "@core/src/managers/Manager.js";

export type EffectName = string;

export type Effect =
  | EffectName
  | { readonly type: EffectName; readonly props?: unknown };

export type Effects = Effect[];

export type EffectHandler = (this: Pont, context: EffectContext) => void;

export type EffectMatcherFn = (this: Pont, name: EffectName) => boolean;

export type EffectMatcher =
  | EffectName
  | RegExp
  | EffectMatcherFn
  | "default"
  | "*";

export type EffectContext = {
  readonly type: EffectName;
  readonly props: unknown;
  handled: () => void;
  readonly wasHandled: boolean;
  readonly wasExecuted: boolean;
  readonly executionCount: number;
};

export type EffectsManagerInit = {
  effects?: EffectsInit;
};

export type EffectsInit =
  | { [K in EffectName | "default" | "*"]?: EffectHandler }
  | EffectInit[]
  | Map<EffectMatcher, EffectHandler>;

export type EffectInit =
  | [EffectMatcher, EffectHandler | undefined]
  | { matcher: EffectMatcher; handler: EffectHandler | undefined };

/**
 * The EventsManager class is responsible for storing and dispatching events.
 */
export class EffectsManager extends Manager {
  protected readonly handlers: {
    string: Record<EffectName, Set<EffectHandler>>;
    regexp: Map<RegExp, Set<EffectHandler>>;
    function: Map<EffectMatcherFn, Set<EffectHandler>>;
    default: Set<EffectHandler>;
    wildcard: Set<EffectHandler>;
  };

  public constructor(pont: Pont) {
    super(pont);

    this.handlers = {
      string: {},
      regexp: new Map(),
      function: new Map(),
      default: new Set(),
      wildcard: new Set(),
    };
  }

  public init({ effects }: EffectsManagerInit = {}): this {
    this.registerEffectHandlers(effects);

    return this;
  }

  public runEffects(effects: Effects | undefined) {
    if (effects) {
      for (const effect of effects) {
        this.runEffect(effect);
      }
    }
  }

  public runEffect(effect: Effect | undefined) {
    if (effect === undefined) {
      return;
    }

    if (S.is(effect)) {
      return this.execute(effect, undefined);
    }

    if (O.is(effect)) {
      const { type, props } = effect;

      return this.execute(type, props);
    }

    throw new Error(
      `Received an invalid effect. It should be a string or an object with a type property.`
    );
  }

  protected execute(effect: EffectName, props: unknown): void {
    const context = this.createEffectContext(effect, props);

    let executed = false;

    executed = this.runStringHandlers(effect, context) || executed;
    executed = this.runRegExpHandlers(effect, context) || executed;
    executed = this.runFunctionHandlers(effect, context) || executed;

    if (!executed) {
      this.runDefaultHandlers(context);
    }

    this.runWildcardHandlers(context);
  }

  protected runStringHandlers(
    effect: EffectName,
    context: EffectContext
  ): boolean {
    const handlers = this.handlers.string[effect];

    let executed = false;

    if (handlers) {
      for (const handler of handlers) {
        this.call(handler, context);
        executed = true;
      }
    }

    return executed;
  }

  protected runRegExpHandlers(
    effect: EffectName,
    context: EffectContext
  ): boolean {
    let executed = false;

    for (const [regexp, handlers] of this.handlers.regexp.entries()) {
      if (regexp.test(effect)) {
        for (const handler of handlers) {
          this.call(handler, context);
          executed = true;
        }
      }
    }

    return executed;
  }

  protected runFunctionHandlers(
    effect: EffectName,
    context: EffectContext
  ): boolean {
    let executed = false;

    for (const [fn, handlers] of this.handlers.function.entries()) {
      if (fn.call(this.pont, effect)) {
        for (const handler of handlers) {
          this.call(handler, context);
          executed = true;
        }
      }
    }

    return executed;
  }

  protected runDefaultHandlers(context: EffectContext): void {
    for (const handler of this.handlers.default) {
      this.call(handler, context);
    }
  }

  protected runWildcardHandlers(context: EffectContext): void {
    for (const handler of this.handlers.wildcard) {
      this.call(handler, context);
    }
  }

  protected call(handler: EffectHandler, context: EffectContext): void {
    handler.call(this.pont, context);
    // @ts-expect-error
    context.__incrementExecutionCount();
  }

  public registerEffectHandlers(effects: EffectsInit | undefined): this {
    if (!effects) {
      return this;
    }

    if (A.is(effects)) {
      for (const effect of effects) {
        this.registerEffectHandler(effect);
      }
    } else if (O.isStrict(effects)) {
      for (const [matcher, handler] of Object.entries(effects)) {
        this.registerEffectHandler([matcher, handler]);
      }
    } else if (effects instanceof Map) {
      for (const [matcher, handler] of effects.entries()) {
        this.registerEffectHandler([matcher, handler]);
      }
    }

    return this;
  }

  public registerEffectHandler(effect: EffectInit): this {
    let matcher: EffectMatcher | undefined, handler: EffectHandler | undefined;

    if (A.is(effect)) {
      [matcher, handler] = effect;
    } else if (O.isStrict(effect)) {
      ({ matcher, handler } = effect);
    }

    if (handler === undefined) {
      return this;
    }

    if (!F.is(handler)) {
      throw new Error(
        `The effect handler is not a function. It should be a function that returns a boolean or undefined.`
      );
    }

    if (matcher === undefined) {
      throw new Error(
        `The effect matcher is not defined. It should be a string, a RegExp, or a function.`
      );
    }

    if (matcher === "default") {
      return this.registerDefaultEffectHandler(handler);
    }

    if (matcher === "*") {
      return this.registerWildcardEffectHandler(handler);
    }

    if (S.is(matcher)) {
      return this.registerStringHandler(matcher, handler);
    }

    if (matcher instanceof RegExp) {
      return this.registerRegExpHandler(matcher, handler);
    }

    if (F.is(matcher)) {
      return this.registerFunctionHandler(matcher, handler);
    }

    throw new Error(
      `The effect matcher is not a valid matcher. It should be a string, a RegExp, or a function.`
    );
  }

  public registerDefaultEffectHandler(handler: EffectHandler): this {
    this.handlers.default.add(handler);

    return this;
  }

  public registerWildcardEffectHandler(handler: EffectHandler): this {
    this.handlers.wildcard.add(handler);

    return this;
  }

  protected registerStringHandler(
    matcher: EffectName,
    handler: EffectHandler
  ): this {
    (this.handlers.string[matcher] ??= new Set()).add(handler);

    return this;
  }

  protected registerRegExpHandler(
    matcher: RegExp,
    handler: EffectHandler
  ): this {
    if (!this.handlers.regexp.has(matcher)) {
      this.handlers.regexp.set(matcher, new Set());
    }

    this.handlers.regexp.get(matcher)!.add(handler);

    return this;
  }

  protected registerFunctionHandler(
    matcher: EffectMatcherFn,
    handler: EffectHandler
  ): this {
    if (!this.handlers.function.has(matcher)) {
      this.handlers.function.set(matcher, new Set());
    }

    this.handlers.function.get(matcher)!.add(handler);

    return this;
  }

  protected createEffectContext(
    type: EffectName,
    props: unknown
  ): EffectContext {
    let wasHandled = false;
    let executionCount = 0;

    const handled = () => {
      wasHandled = true;
    };

    const incrementExecutionCount = () => {
      executionCount++;
    };

    return {
      type,
      props,
      handled,
      get wasHandled() {
        return wasHandled;
      },
      get wasExecuted() {
        return executionCount > 0;
      },
      get executionCount() {
        return executionCount;
      },
      // @ts-expect-error
      __incrementExecutionCount: incrementExecutionCount,
    };
  }
}
