import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/mortgage" element={<Mortgage />} />
          <Route path="/news" element={<News />} />
          <Route path="/services" element={<Services />} />
          <Route path="/listings/:id" element={<SingleListing />} />
          <Route path="/news/:id" element={<SingleNews />} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}
