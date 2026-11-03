import { Outlet } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <ScrollToTop />
      <Canonical />
      <Hreflang />
      <div className="layout">
        <header className={`layout__header ${isScrolled ? "scrolled" : ""}`}>
          <Header />
        </header>

        <main className="layout__main">
          <div className="layout__content">
            <Suspense fallback={null}>
              <Outlet />
            </Suspense>
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
