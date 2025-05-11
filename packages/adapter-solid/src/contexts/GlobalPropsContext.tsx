import type { GlobalProps } from "@auaust/pont";
import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { usePont } from "./PontContext.jsx";

export const GlobalPropsContext = createContext<GlobalProps>();

export function GlobalPropsProvider(props: ParentProps) {
  const pont = usePont();

  const [globalProps, setGlobalProps] = createStore(pont.getPageProps());

  return (
    <GlobalPropsContext.Provider value={globalProps}>
      {props.children}
    </GlobalPropsContext.Provider>
  );
}

export function useGlobalProps(): GlobalProps {
  return useContext(GlobalPropsContext)!;
}
