import { type EffectContext, Pont, type PontInit } from "@auaust/pont";
import { transporter } from "@core/tests/mocks/Transporter.js";
import { describe } from "node:test";
import { beforeEach, expect, test, vitest } from "vitest";

describe("Pont effects", () => {
  const init: PontInit = {
    baseUrl: "https://example.com",
    services: {
      transporter,
    },
  };

  const defaultHandler = vitest.fn();
  const wildcardHandler = vitest.fn();
  const stringHandler = vitest.fn();
  const regexpHandler = vitest.fn();
  const functionMatcher = vitest.fn(
    (name: string) => name === "my-function-effect"
  );
  const functionHandler = vitest.fn();

  let pont: Pont;

  beforeEach(() => {
    vitest.clearAllMocks();

    pont = Pont.from({
      ...init,
      effects: [
        { matcher: "default", handler: defaultHandler },
        ["*", wildcardHandler],
        { matcher: "my-string-effect", handler: stringHandler },
        [/regexp/, regexpHandler],
        [functionMatcher, functionHandler],
      ],
    });
  });

  const visit = async () =>
    await pont.post("/return-json-as-is", {
      effects: [
        { type: "my-string-effect", props: { message: "Hello" } },
        "my-regexp-effect",
        { type: "does-not-exist" },
      ],
    });

  describe("default handler", () => {
    test("is called only for unmatched effects", async () => {
      await visit();

      expect(defaultHandler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          type: "does-not-exist",
        })
      );
    });
  });

  describe("wildcard handler", () => {
    test("is called for every effect", async () => {
      await visit();

      expect(wildcardHandler).toHaveBeenCalledTimes(3);

      expect(wildcardHandler).toHaveBeenCalledWith(
        expect.objectContaining({ type: "my-string-effect" })
      );
      expect(wildcardHandler).toHaveBeenCalledWith(
        expect.objectContaining({ type: "my-regexp-effect" })
      );
      expect(wildcardHandler).toHaveBeenCalledWith(
        expect.objectContaining({ type: "does-not-exist" })
      );
    });
  });

  describe("string matcher", () => {
    test("matches and handles exact type string", async () => {
      await visit();

      expect(stringHandler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          type: "my-string-effect",
          props: { message: "Hello" },
        })
      );
    });
  });

  describe("regex matcher", () => {
    test("matches type via pattern", async () => {
      await visit();

      expect(regexpHandler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          type: "my-regexp-effect",
        })
      );
    });
  });

  describe("function matcher", () => {
    test("is invoked for every effect type", async () => {
      await visit();

      expect(functionMatcher).toHaveBeenCalledWith("my-string-effect");
      expect(functionMatcher).toHaveBeenCalledWith("my-regexp-effect");
      expect(functionMatcher).toHaveBeenCalledWith("does-not-exist");
    });

    test("executes handler only on positive match", async () => {
      await visit();

      expect(functionHandler).not.toHaveBeenCalled();
    });
  });

  describe("have a handling state", () => {
    test("that is shared between effects", async () => {
      let handledInStringHandler: boolean | undefined;
      let handledInWildcardHandler: boolean | undefined;

      stringHandler.mockImplementationOnce(({ wasHandled, handled }) => {
        handledInStringHandler = wasHandled;
        handled();
      });

      wildcardHandler.mockImplementationOnce(({ wasHandled }) => {
        handledInWildcardHandler = wasHandled;
      });

      await visit();

      expect(handledInStringHandler).toBe(false);
      expect(handledInWildcardHandler).toBe(true);
    });
  });

  describe("keep track of executions", () => {
    test("and expose the execution count", async () => {
      let stringHandlerCount: number | undefined;
      let executedInStringHandler: boolean | undefined;
      let wildcardHandlerCount: number | undefined;
      let executedInWildcardHandler: boolean | undefined;

      stringHandler.mockImplementationOnce(
        ({ wasExecuted, executionCount }: EffectContext) => {
          executedInStringHandler = wasExecuted;
          stringHandlerCount = executionCount;
        }
      );

      wildcardHandler.mockImplementationOnce(
        ({ wasExecuted, executionCount }: EffectContext) => {
          executedInWildcardHandler = wasExecuted;
          wildcardHandlerCount = executionCount;
        }
      );

      await visit();

      expect(stringHandlerCount).toBe(0);
      expect(executedInStringHandler).toBe(false);
      expect(wildcardHandlerCount).toBe(1);
      expect(executedInWildcardHandler).toBe(true);
    });
  });

  describe("cause errors", () => {
    test("if no handler matched an effect", async () => {
      pont = Pont.from({
        ...init,
      });

      await expect(async () => await visit()).rejects.toThrowError(
        /sure to register a handler/
      );
    });
  });

  describe("can be registered after Pont creation", () => {
    test("registers a string handler dynamically", async () => {
      const handler = vitest.fn();

      pont.registerEffectHandler("dynamic-handler", handler);

      await pont.post("/return-json-as-is", {
        effects: ["dynamic-handler"],
      });

      expect(handler).toHaveBeenCalledOnce();
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ type: "dynamic-handler" })
      );
    });

    test("returns a function to unregister the handler", async () => {
      const handler = vitest.fn();

      const unregister = pont.registerEffectHandler("dynamic-handler", handler);

      await pont.post("/return-json-as-is", {
        effects: ["dynamic-handler"],
      });

      expect(handler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ type: "dynamic-handler" })
      );

      expect(wildcardHandler).toHaveBeenCalledWith(
        expect.objectContaining({ type: "dynamic-handler" })
      );

      unregister();

      handler.mockClear();

      await pont.post("/return-json-as-is", {
        effects: ["dynamic-handler"],
      });

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
