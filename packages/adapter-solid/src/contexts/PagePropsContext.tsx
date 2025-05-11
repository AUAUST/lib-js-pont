import type { PageProps } from "@auaust/pont";
import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { usePont } from "./PontContext.jsx";

export const PagePropsContext = createContext<PageProps>();

export function PagePropsProvider(props: ParentProps) {
  const pont = usePont();

  const [pageProps, setPageProps] = createStore(pont.getPageProps());

  return (
    <PagePropsContext.Provider value={pageProps}>
      {props.children}
    </PagePropsContext.Provider>
  );
}

export function usePageProps(): PageProps {
  return useContext(PagePropsContext)!;
}
