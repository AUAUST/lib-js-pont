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
  resolveLayout?: ComponentResolver<LayoutName>;
};

export function App(props: PontAppProps) {
  const [layoutName, setLayoutName] = createSignal<string>(
    props.pont.getLayout?.()
  );
  const [componentName, setComponentName] = createSignal<string>(
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
    on(layoutName, async (name, prev) => {
      if (name !== prev) {
        const layout = await resolveComponent(props.resolveLayout, name);

        setLayout(() => layout);
      }
    })
  );

  createEffect(
    on(componentName, async (name, prev) => {
      if (name !== prev) {
        const component = await resolveComponent(props.resolveComponent, name);

        setComponent(() => component);
      }
    })
  );

  const Page = children(() => {
    const Component = component()!;

    return (
      <Show when={Component}>
        <Component {...pageProps()} />
      </Show>
    );
  });

  const Content = children(() => {
    const Layout = layout()!;

    return (
      <Show when={Layout} fallback={<Page />}>
        <Layout {...layoutProps()}>
          <Page />
        </Layout>
      </Show>
    );
  });

  return (
    <MetaProvider>
      <Content />
    </MetaProvider>
  );
}
