import { Outlet } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import "../styles/layout/publicLayout.css";
import ScrollToTop from "../components/General/ScrollToTop";
import FloatingMobileActions from "../components/Mobile/FloatingMobileActions";
import { Canonical } from "../components/SEO/Canonical";
import { useHtmlLang } from "../hooks/i18n/useHtmlLang";
import { useSyncLangRoute } from "../hooks/i18n/useSyncLandRoute";
import { Hreflang } from "../components/SEO/Hreflang";

export default function PublicLayout() {
  useHtmlLang();
  useSyncLangRoute();
  return (
    <>
      <ScrollToTop />
      <Canonical />
      <Hreflang />
      <div className="layout">
        <header className="layout__header">
          <Header />
        </header>

        <main className="layout__main">
          <div className="layout__content">
            <Outlet />
          </div>
        </main>

        <footer className="layout__footer">
          <Footer />
          <FloatingMobileActions />
        </footer>
      </div>
    </>
  );
}
