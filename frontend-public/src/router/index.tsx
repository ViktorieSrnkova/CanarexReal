import { lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/HomePage";
const Page404 = lazy(() => import("../pages/404"));
const Contact = lazy(() => import("../pages/Contact"));
import Listings from "../pages/Listings";
import SingleListing from "../pages/SingleListing";
const FAQ = lazy(() => import("../pages/FAQ"));
const GDPR = lazy(() => import("../pages/GDPR"));
const Map = lazy(() => import("../pages/Map"));
const Mortgage = lazy(() => import("../pages/Mortgage"));
const News = lazy(() => import("../pages/News"));
const Services = lazy(() => import("../pages/Services"));
const SingleNews = lazy(() => import("../pages/SingleNews"));
import { LangGuard } from "../components/SEO/LangGuard";
import type { FxRates } from "../types/general";
import { RangesContext, type Ranges } from "../RangesContext";
import { getFxRates, getRanges } from "../api/listings";
import { FxContext } from "../FxContext";
import { ProtectedRoute } from "../Auth/protectedRoute";
const Favorites = lazy(() => import("../pages/Favorites"));
const Forms = lazy(() => import("../pages/Forms"));
const UserSettings = lazy(() => import("../pages/UserSettings"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

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
          <Route path="gdpr" element={<GDPR />} />

          <Route
            path="listings"
            element={
              <RangesContext.Provider value={ranges}>
                <Listings />
              </RangesContext.Provider>
            }
          />
          <Route
            path="map"
            element={
              <RangesContext.Provider value={ranges}>
                <Map />
              </RangesContext.Provider>
            }
          />
          <Route path="mortgage" element={<Mortgage />} />
          <Route path="news" element={<News />} />
          <Route path="services" element={<Services />} />
          <Route
            path="me"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="reset-password"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="forms"
            element={
              <ProtectedRoute>
                <Forms />
              </ProtectedRoute>
            }
          />
          <Route
            path="listings/:index"
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
