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
import {
  LayoutPropsProvider,
  useLayoutProps,
} from "./contexts/LayoutPropsContext.jsx";
import {
  PagePropsProvider,
  usePageProps,
} from "./contexts/PagePropsContext.jsx";
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

  return (
    <MetaProvider>
      <PontProvider pont={props.pont}>
        <Title>{title()}</Title>

        <GlobalPropsProvider>
          <LayoutPropsProvider>
            <PagePropsProvider>
              <View layout={layout()} page={page()} />
            </PagePropsProvider>
          </LayoutPropsProvider>
        </GlobalPropsProvider>
      </PontProvider>
    </MetaProvider>
  );
}

function View(props: { page: Component; layout?: ParentComponent }) {
  const layoutProps = useLayoutProps();
  const pageProps = usePageProps();

  const Page = children(() => {
    const Page = props.page;

    return (
      <Show when={Page}>
        <Page {...pageProps} />
      </Show>
    );
  });

  const Content = children(() => {
    const Layout = props.layout!;

    return (
      <Show when={Layout} fallback={<Page />}>
        <Layout {...layoutProps}>
          <Page />
        </Layout>
      </Show>
    );
  });

  return <Content />;
}
