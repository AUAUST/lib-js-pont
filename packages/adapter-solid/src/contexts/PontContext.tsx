import type { Pont } from "@auaust/pont";
import { createContext, ParentProps, useContext } from "solid-js";

export const PontContext = createContext<Pont>();

export function PontProvider(
  props: ParentProps<{
    pont: Pont;
  }>
) {
  return (
    <PontContext.Provider value={props.pont}>
      {props.children}
    </PontContext.Provider>
  );
}

export function usePont(): Pont {
  return useContext(PontContext)!;
}
