import { createPontApp } from "@auaust/pont-adapter-solid";
import { render } from "solid-js/web";

createPontApp({
  resolveComponent: async (name) => {
    const pages = import.meta.glob("./Pages/**/*.tsx");

    return await pages[`./pages/${name}.tsx`]();
  },
  resolveLayout: async (name) => {
    const layouts = import.meta.glob("./Layouts/**/*.tsx");

    return await layouts[`./layouts/${name}.tsx`]();
  },
  setup: ({ element, App, props }) => {
    render(() => <App {...props} />, element!);
  },
});
