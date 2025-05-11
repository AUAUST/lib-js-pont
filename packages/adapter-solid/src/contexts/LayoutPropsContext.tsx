import type { LayoutProps } from "@auaust/pont";
import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { usePont } from "./PontContext.jsx";

export const LayoutPropsContext = createContext<LayoutProps>();

export function LayoutPropsProvider(props: ParentProps) {
  const pont = usePont();

  const [layoutProps, setLayoutProps] = createStore(pont.getLayoutProps());

  return (
    <LayoutPropsContext.Provider value={layoutProps}>
      {props.children}
    </LayoutPropsContext.Provider>
  );
}

export function useLayoutProps(): LayoutProps {
  return useContext(LayoutPropsContext)!;
}
