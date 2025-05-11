import type { ComponentName, LayoutName, Pont } from "@auaust/pont";
import { MetaProvider } from "@solidjs/meta";
import {
  batch,
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
    // @ts-expect-error
    props.pont.getLayout?.()
  );
  const [componentName, setComponentName] = createSignal<string>(
    props.pont.getComponent()
  );

  const [globalProps, setGlobalProps] = createSignal(
    props.pont.getGlobalProps()
  );
  const [layoutProps, setLayoutProps] = createSignal(
    // @ts-expect-error
    props.pont.getLayoutProps?.()
  );
  const [pageProps, setPageProps] = createSignal(props.pont.getPageProps());

  const [layout, setLayout] = createSignal<Component>();
  const [component, setComponent] = createSignal<Component>();

  createEffect(
    on(
      () => [layoutName(), componentName()],
      async ([layoutName, componentName]) => {
        const layout = await resolveComponent(props.resolveLayout, layoutName);
        const component = await resolveComponent(
          props.resolveComponent,
          componentName
        );

        batch(() => {
          setLayout(() => layout);
          setComponent(() => component);
        });
      }
    )
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
