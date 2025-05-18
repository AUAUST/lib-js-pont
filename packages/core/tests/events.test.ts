import { EventListeners, Pont, PontInit } from "@auaust/pont";
import { S } from "@auaust/primitive-kit";
import { transporter } from "@core/tests/mocks/Transporter.js";
import { describe } from "node:test";
import { expect, test, vitest } from "vitest";

describe("Pont events", () => {
  const init: PontInit = {
    baseUrl: "https://example.com",
    services: {
      transporter,
    },
  };

  const events = [
    "before",
    "error",
    "exception",
    "finish",
    "prevented",
    "received",
    "start",
    "success",
    "unhandled",
  ] as const;

  {
    const pont = Pont.from(init);

    test.each(events)(
      "should expose '%s' event registration methods",
      (event) => {
        const on = `on${S.capitalize(event)}` as const;

        expect(pont[on]).toBeTypeOf("function");
        expect(() => pont.on(event, () => {})).not.toThrow();
      }
    );
  }

  test("can be registered from the init", async () => {
    const onStart = vitest.fn();
    const onFinish = vitest.fn();

    const pont = Pont.from({
      ...init,
      listeners: {
        onStart,
        onFinish,
      },
    });

    await pont.visit("/");

    expect(onStart).toHaveBeenCalledOnce();
    expect(onFinish).toHaveBeenCalledOnce();
  });

  test("can be registered with on-methods", async () => {
    const onStart = vitest.fn();
    const onFinish = vitest.fn();

    const pont = Pont.from(init);

    pont.on("start", onStart);
    pont.onFinish(onFinish);

    await pont.visit("/");

    expect(onStart).toHaveBeenCalledOnce();
    expect(onFinish).toHaveBeenCalledOnce();
  });

  test("with the correct this value", async () => {
    const thisValues: any[] = [];

    const pushThis = function (this: Pont) {
      thisValues.push(this);
    };

    const listeners = {
      onBefore: vitest.fn(pushThis),
      onStart: vitest.fn(pushThis),
      onSuccess: vitest.fn(pushThis),
      onFinish: vitest.fn(pushThis),
    } satisfies EventListeners;

    const pont = Pont.from({
      ...init,
      listeners,
    });

    await pont.visit("/");

    expect(thisValues).toHaveLength(4);

    for (const thisValue of thisValues) {
      expect(thisValue).toBe(pont);
    }
  });
});
