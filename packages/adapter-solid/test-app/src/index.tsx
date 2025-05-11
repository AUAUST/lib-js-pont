import { createPontApp } from "@auaust/pont-adapter-solid";
import type { Component } from "solid-js";
import { render } from "solid-js/web";

createPontApp({
  resolvePage: async (name) => {
    const pages = import.meta.glob("./Pages/**/*.tsx");

    return (await pages[`./pages/${name}.tsx`]()) as Component;
  },
  resolveLayout: async (name) => {
    const layouts = import.meta.glob("./Layouts/**/*.tsx");

    return (await layouts[`./layouts/${name}.tsx`]()) as Component;
  },
  setup: ({ element, App, props }) => {
    render(() => <App {...props} />, element!);
  },
});
