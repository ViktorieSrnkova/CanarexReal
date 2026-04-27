import { createContext, useContext } from "react";
import type { FxRates } from "./types/general";

export const FxContext = createContext<FxRates | null>(null);

export const useFx = () => {
  return useContext(FxContext);
};
