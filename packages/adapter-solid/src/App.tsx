import type { ComponentName, LayoutName, Pont } from "@auaust/pont";
import { MetaProvider } from "@solidjs/meta";
import {
  children,
  Component,
  createEffect,
  createSignal,
  on,
  Show,
} from "solid-js";
import type { ComponentResolver } from "./createPontApp.jsx";
import { resolveComponent } from "./utils/resolveComponent.js";

export type PontAppProps = {
  pont: Pont;
  resolveComponent: ComponentResolver<ComponentName>;
  resolveLayout: ComponentResolver<LayoutName>;
};

export function App(props: PontAppProps) {
  const [layoutName, setLayoutName] = createSignal(props.pont.getLayout?.());
  const [componentName, setComponentName] = createSignal(
    props.pont.getComponent()
  );

  const [globalProps, setGlobalProps] = createSignal(
    props.pont.getGlobalProps()
  );
  const [layoutProps, setLayoutProps] = createSignal(
    props.pont.getLayoutProps?.()
  );
  const [pageProps, setPageProps] = createSignal(props.pont.getPageProps());

  const [layout, setLayout] = createSignal<Component>();
  const [component, setComponent] = createSignal<Component>();

  createEffect(
    on(layoutName, async (name) => {
      const layout = await resolveComponent(props.resolveLayout, name);
      setLayout(() => layout);
    })
  );

  createEffect(
    on(componentName, async (name) => {
      const component = await resolveComponent(props.resolveComponent, name);
      setComponent(() => component);
    })
  );

  const Component = children(() => {
    const Component = component()!;

    return (
      <Show when={Component}>
        <Component {...pageProps()} />
      </Show>
    );
  });

  const Layout = children(() => {
    const Layout = layout()!;

    return (
      <Show when={Layout} fallback={<Component />}>
        <Layout {...layoutProps()}>{Component}</Layout>
      </Show>
    );
  });

  return (
    <MetaProvider>
      <Layout />
    </MetaProvider>
  );
}
