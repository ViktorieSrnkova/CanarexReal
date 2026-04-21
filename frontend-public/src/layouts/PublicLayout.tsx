import { Outlet } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import "../styles/layout/publicLayout.css";
import ScrollToTop from "../components/General/ScrollToTop";

export default function PublicLayout() {
  return (
    <>
      <ScrollToTop />

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
        </footer>
      </div>
    </>
  );
}
