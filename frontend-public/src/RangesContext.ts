import { createContext, useContext } from "react";

export type Ranges = {
  price: [number, number];
  size: [number, number];
};

export const RangesContext = createContext<Ranges | null>(null);

export function useRanges() {
  return useContext(RangesContext);
}
