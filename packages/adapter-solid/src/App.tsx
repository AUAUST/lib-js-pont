import type { LayoutName, PageName, Pont } from "@auaust/pont";
import { MetaProvider, Title } from "@solidjs/meta";
import {
  children,
  createSignal,
  Show,
  type Component,
  type ParentComponent,
} from "solid-js";
import { GlobalPropsProvider } from "./contexts/GlobalPropsContext.jsx";
import { LayoutPropsProvider } from "./contexts/LayoutPropsContext.jsx";
import { PagePropsProvider } from "./contexts/PagePropsContext.jsx";
import { PontProvider } from "./contexts/PontContext.jsx";
import type { ComponentResolver } from "./createPontApp.jsx";

export type PontAppProps = {
  pont: Pont;
  resolvePage: ComponentResolver<PageName>;
  resolveLayout?: ComponentResolver<LayoutName, ParentComponent>;
  initialPage: Component;
  initialLayout?: ParentComponent;
};

export function App(props: PontAppProps) {
  const [title, setTitle] = createSignal<string>(props.pont.getTitle());

  const [layoutName, setLayoutName] = createSignal<string>(
    props.pont.getLayout()
  );
  const [pageName, setPageName] = createSignal<string>(props.pont.getPage());

  const [page, setPage] = createSignal<Component>(props.initialPage);

  const [layout, setLayout] = createSignal<ParentComponent | undefined>(
    props.initialLayout
  );

  const Page = children(() => {
    const Page = page()!;

    return (
      <Show when={Page}>
        <Page />
      </Show>
    );
  });

  const Content = children(() => {
    const Layout = layout()!;

    if (Layout) {
      return (
        // @ts-ignore
        <Layout {...layoutProps()}>
          <Page />
        </Layout>
      );
    }

    return <Page />;
  });

  return (
    <PontProvider pont={props.pont}>
      <MetaProvider>
        <Title>{title()}</Title>

        <GlobalPropsProvider>
          <LayoutPropsProvider>
            <PagePropsProvider>
              <Content />
            </PagePropsProvider>
          </LayoutPropsProvider>
        </GlobalPropsProvider>
      </MetaProvider>
    </PontProvider>
  );
}
