import type { LayoutName, PageName, Pont } from "@auaust/pont";
import { Base, MetaProvider, Title } from "@solidjs/meta";
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
  resolvePage: ComponentResolver<PageName>;
  resolveLayout?: ComponentResolver<LayoutName>;
};

export function App(props: PontAppProps) {
  const [layoutName, setLayoutName] = createSignal<string>(
    props.pont.getLayout()
  );
  const [pageName, setPageName] = createSignal<string>(props.pont.getPage());

  const [globalProps, setGlobalProps] = createSignal(
    props.pont.getGlobalProps()
  );
  const [layoutProps, setLayoutProps] = createSignal(
    props.pont.getLayoutProps()
  );
  const [pageProps, setPageProps] = createSignal(props.pont.getPageProps());

  const [layout, setLayout] = createSignal<Component>();
  const [page, setPage] = createSignal<Component>();
  const [title, setTitle] = createSignal<string>(props.pont.getTitle());

  createEffect(
    on(
      () => [layoutName(), pageName()],
      async ([layoutName, pageName]) => {
        const layout = await resolveComponent(props.resolveLayout, layoutName);
        const page = await resolveComponent(props.resolvePage, pageName);

        batch(() => {
          setLayout(() => layout);
          setPage(() => page);
        });
      }
    )
  );

  const Page = children(() => {
    const Page = page()!;

    return (
      <Show when={Page}>
        <Page {...pageProps()} />
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
      <Title>{title()}</Title>
      <Base href={props.pont.getBaseUrl()} />

      <Content />
    </MetaProvider>
  );
}
