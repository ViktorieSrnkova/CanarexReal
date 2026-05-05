import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/HomePage";
import Page404 from "../pages/404";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Fees from "../pages/Fees";
import GDPR from "../pages/GDPR";
import Listings from "../pages/Listings";
import Mortgage from "../pages/Mortgage";
import News from "../pages/News";
import Services from "../pages/Services";
import SingleListing from "../pages/SingleListing";
import SingleNews from "../pages/SingleNews";
import { LangGuard } from "../components/SEO/LangGuard";
import type { FxRates } from "../types/general";
import { RangesContext, type Ranges } from "../RangesContext";
import { useEffect, useState } from "react";
import { getFxRates, getRanges } from "../api/listings";
import { FxContext } from "../FxContext";

export default function Router() {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cs" replace />} />
        <Route
          path="/:lang"
          element={
            <LangGuard>
              <PublicLayout />
            </LangGuard>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="fees" element={<Fees />} />
          <Route path="gdpr" element={<GDPR />} />

          <Route
            path="listings"
            element={
              <RangesContext.Provider value={ranges}>
                <Listings />
              </RangesContext.Provider>
            }
          />
          <Route path="mortgage" element={<Mortgage />} />
          <Route path="news" element={<News />} />
          <Route path="services" element={<Services />} />
          <Route
            path="listings/:id"
            element={
              <FxContext.Provider value={rates}>
                <SingleListing />
              </FxContext.Provider>
            }
          />
          <Route path="news/:id" element={<SingleNews />} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}
