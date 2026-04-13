import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import LoginPage from "../pages/login/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";

import ListingsPage from "../pages/listings/ListingsPage";
import ListingCreatePage from "../pages/listings/ListingCreatePage";
import ListingEditPage from "../pages/listings/ListingEditPage";

import NewsPage from "../pages/news/NewsPage";
import NewsCreatePage from "../pages/news/NewsCreatePage";

import ContactFormsPage from "../pages/forms/ContactFormsPage";
import FormDetailPage from "../pages/forms/FormDetailPage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import CenteredLayout from "../layouts/CenteredLayout";
import AuthGuard from "../auth/AuthGueard";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CenteredLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<DashboardPage />} />

          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/create" element={<ListingCreatePage />} />
          <Route path="/listings/edit/:id" element={<ListingEditPage />} />

          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/create" element={<NewsCreatePage />} />

          <Route path="/forms" element={<ContactFormsPage />} />
          <Route path="/forms/:id" element={<FormDetailPage />} />
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
