import type { LayoutName, PageName, Pont } from "@auaust/pont";
import { MetaProvider, Title } from "@solidjs/meta";
import {
  children,
  createResource,
  createSignal,
  Show,
  Suspense,
  type ParentComponent,
} from "solid-js";
import { GlobalPropsProvider } from "./contexts/GlobalPropsContext.jsx";
import { LayoutPropsProvider } from "./contexts/LayoutPropsContext.jsx";
import { PagePropsProvider } from "./contexts/PagePropsContext.jsx";
import { PontProvider } from "./contexts/PontContext.jsx";
import type { ComponentResolver } from "./createPontApp.jsx";
import { resolveComponent } from "./utils/resolveComponent.js";

export type PontAppProps = {
  pont: Pont;
  resolvePage: ComponentResolver<PageName>;
  resolveLayout?: ComponentResolver<LayoutName, ParentComponent>;
};

export function App(props: PontAppProps) {
  const [title, setTitle] = createSignal<string>(props.pont.getTitle());

  const [layoutName, setLayoutName] = createSignal<string>(
    props.pont.getLayout()
  );
  const [pageName, setPageName] = createSignal<string>(props.pont.getPage());

  const [page] = createResource(
    pageName,
    async (name) => await resolveComponent(props.resolvePage, name)
  );

  const [layout] = createResource(
    layoutName,
    async (name) => await resolveComponent(props.resolveLayout, name)
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
              <Suspense>
                <Content />
              </Suspense>
            </PagePropsProvider>
          </LayoutPropsProvider>
        </GlobalPropsProvider>
      </MetaProvider>
    </PontProvider>
  );
}
