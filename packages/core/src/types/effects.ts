/**
 * An array of effects to be executed on the client side.
 */
export type Effects = Effect[];

/**
 * An effect to be executed on the client side, requested by the server.
 * If might include a payload providing additional data needed to execute the effect.
 * If the effect is a string, it is equivalent to an object with the type set to the string value.
 */
export type Effect =
  | string
  | {
      /**
       * The effect type. The frontend application should provide a handler for each used effect type, or a default handler.
       */
      readonly type: string;

      /**
       * The effect payload. Any additional data needed to execute the effect.
       */
      readonly props?: unknown;
    };
