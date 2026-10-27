import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import CenteredLayout from "../layouts/CenteredLayout";
import AuthGuard from "../auth/AuthGuard";
import { Spin } from "antd";

const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));

const ListingsPage = lazy(() => import("../pages/listings/ListingsPage"));
import ListingCreatePage from "../pages/listings/ListingCreatePage";

const NewsPage = lazy(() => import("../pages/news/NewsPage"));
import NewsCreatePage from "../pages/news/NewsCreatePage";

const ContactFormsPage = lazy(() => import("../pages/forms/ContactFormsPage"));
const FormDetailPage = lazy(() => import("../pages/forms/FormDetailPage"));

const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/errors/UnauthorizedPage"));
const PrintListing = lazy(() => import("../pages/print/PrintListing"));

function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "transparent",
      }}
    >
      <Spin size="large" />
    </div>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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

            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/create" element={<NewsCreatePage />} />

            <Route path="/forms" element={<ContactFormsPage />} />
            <Route path="/forms/:id" element={<FormDetailPage />} />

            <Route path="/print" element={<PrintListing />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
