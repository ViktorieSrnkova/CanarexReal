import { useState, useEffect } from "react";
import { getFxRates, getRanges } from "./api/listings";
import Router from "./router";
import type { FxRates } from "./types/general";
import { FxContext } from "./FxContext";
import { RangesContext, type Ranges } from "./RangesContext";

function App() {
  const [rates, setRates] = useState<FxRates | null>(null);
  const [ranges, setRange] = useState<Ranges | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await getFxRates();
        setRates(data);
        const range = await getRanges();

        setRange({
          price: [range.min.cena_v_eur, range.max.cena_v_eur],
          size: [range.min.velikost, range.max.velikost],
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadRates();
  }, []);
  return (
    <FxContext.Provider value={rates}>
      <RangesContext.Provider value={ranges}>
        {ranges ? <Router /> : "loading ranges..."}
      </RangesContext.Provider>
    </FxContext.Provider>
  );
}

export default App;
