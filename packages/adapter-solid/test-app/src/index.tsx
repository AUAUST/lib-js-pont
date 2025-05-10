import { createPontApp } from "@auaust/pont-adapter-solid";
import { render } from "solid-js/web";

createPontApp({
  resolveComponent: async (name) => {
    const pages = import.meta.glob("./Pages/**/*.tsx");

    return await pages[`./Pages/${name}.tsx`];
  },
  setup: ({ App, element, propsGroups }) => {
    render(() => <App {...propsGroups} />, element);
  },
});
