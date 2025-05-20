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

    this.runStringHandlers(effect, context);
    this.runRegExpHandlers(effect, context);
    this.runFunctionHandlers(effect, context);

    if (!context.wasExecuted) {
      this.runDefaultHandlers(context);
    }

    this.runWildcardHandlers(context);

    if (!context.wasExecuted) {
      throw new Error(
        `The effect "${effect}" was not handled. Make sure to register a handler for it, or use a default or wildcard handler.`
      );
    }
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

  public registerEffectHandler(
    matcher: EffectMatcher,
    handler: EffectHandler
  ): () => void;
  public registerEffectHandler(effect: EffectInit): () => void;
  public registerEffectHandler(
    effectOrName: EffectInit | EffectMatcher,
    maybeHandler?: EffectHandler
  ): () => void {
    let matcher: EffectMatcher | undefined, handler: EffectHandler | undefined;

    if (A.is(effectOrName)) {
      [matcher, handler] = effectOrName;
    } else if (
      S.is(effectOrName) ||
      F.is(effectOrName) ||
      effectOrName instanceof RegExp
    ) {
      matcher = effectOrName;
      handler = maybeHandler;
    } else if (O.is(effectOrName)) {
      ({ matcher, handler } = effectOrName);
    }

    if (handler === undefined) {
      return F.noop;
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

  public registerDefaultEffectHandler(handler: EffectHandler): () => void {
    this.handlers.default.add(handler);

    return () => this.unregisterDefaultEffectHandler(handler);
  }

  protected unregisterDefaultEffectHandler(handler: EffectHandler) {
    this.handlers.default.delete(handler);
  }

  public registerWildcardEffectHandler(handler: EffectHandler): () => void {
    this.handlers.wildcard.add(handler);

    return () => this.unregisterWildcardEffectHandler(handler);
  }

  protected unregisterWildcardEffectHandler(handler: EffectHandler) {
    this.handlers.wildcard.delete(handler);
  }

  protected registerStringHandler(
    matcher: EffectName,
    handler: EffectHandler
  ): () => void {
    (this.handlers.string[matcher] ??= new Set()).add(handler);

    return () => this.unregisterStringHandler(matcher, handler);
  }

  protected unregisterStringHandler(
    matcher: EffectName,
    handler: EffectHandler
  ) {
    this.handlers.string[matcher]?.delete(handler);
  }

  protected registerRegExpHandler(
    matcher: RegExp,
    handler: EffectHandler
  ): () => void {
    if (!this.handlers.regexp.has(matcher)) {
      this.handlers.regexp.set(matcher, new Set());
    }

    this.handlers.regexp.get(matcher)!.add(handler);

    return () => this.unregisterRegExpHandler(matcher, handler);
  }

  protected unregisterRegExpHandler(matcher: RegExp, handler: EffectHandler) {
    this.handlers.regexp.get(matcher)?.delete(handler);
  }

  protected registerFunctionHandler(
    matcher: EffectMatcherFn,
    handler: EffectHandler
  ): () => void {
    if (!this.handlers.function.has(matcher)) {
      this.handlers.function.set(matcher, new Set());
    }

    this.handlers.function.get(matcher)!.add(handler);

    return () => this.unregisterFunctionHandler(matcher, handler);
  }

  protected unregisterFunctionHandler(
    matcher: EffectMatcherFn,
    handler: EffectHandler
  ) {
    this.handlers.function.get(matcher)?.delete(handler);
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
