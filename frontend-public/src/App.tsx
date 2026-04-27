import { useState, useEffect } from "react";
import { getFxRates } from "./api/listings";
import Router from "./router";
import type { FxRates } from "./types/general";
import { FxContext } from "./FxContext";

function App() {
  const [rates, setRates] = useState<FxRates | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const data = await getFxRates();
        setRates(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadRates();
  }, []);
  return (
    <FxContext.Provider value={rates}>
      <Router />
    </FxContext.Provider>
  );
}

export default App;
