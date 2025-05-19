import { Pont, type PontInit } from "@auaust/pont";
import { transporter } from "@core/tests/mocks/Transporter.js";
import { describe } from "node:test";
import { beforeAll, expect, test, vitest } from "vitest";

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

  beforeAll(() => {
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

  beforeAll(async () => {
    await pont.post("/return-json-as-is", {
      effects: [
        { type: "my-string-effect", props: { message: "Hello" } },
        "my-regexp-effect",
        { type: "does-not-exist" },
      ],
    });
  });

  describe("default handler", () => {
    test("is called only for unmatched effects", () => {
      expect(defaultHandler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          type: "does-not-exist",
        })
      );
    });
  });

  describe("wildcard handler", () => {
    test("is called for every effect", () => {
      expect(wildcardHandler).toHaveBeenCalledTimes(3);
    });
  });

  describe("string matcher", () => {
    test("matches and handles exact type string", () => {
      expect(stringHandler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          type: "my-string-effect",
          props: { message: "Hello" },
        })
      );
    });
  });

  describe("regex matcher", () => {
    test("matches type via pattern", () => {
      expect(regexpHandler).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          type: "my-regexp-effect",
        })
      );
    });
  });

  describe("function matcher", () => {
    test("is invoked for every effect type", () => {
      expect(functionMatcher).toHaveBeenCalledWith("my-string-effect");
      expect(functionMatcher).toHaveBeenCalledWith("my-regexp-effect");
      expect(functionMatcher).toHaveBeenCalledWith("does-not-exist");
    });

    test("executes handler only on positive match", () => {
      expect(functionHandler).not.toHaveBeenCalled();
    });
  });
});
