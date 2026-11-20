import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import User from "../../assets/user.svg";
import LoggedIn from "../../assets/userLogin.svg";
import { useT } from "../../i18n";
import { useLang } from "../../hooks/i18n/useLang";
import AuthModal from "../Login/AuthModal";
import "../../styles/layout/nav.css";
import { useAuth } from "../../Auth/authStore";
import Button from "../General/Button";

type Props = {
  onLinkClick: () => void;
};

function Navbar({ onLinkClick }: Props) {
  const t = useT();
  const { lang } = useLang();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: t("header.home"), path: `/${lang}` },
    {
      label: t("header.listings"),
      path: `/${lang}/listings`,
      preserveFilters: true,
    },
    { label: t("header.map"), path: `/${lang}/map`, preserveFilters: true },
    { label: t("header.services"), path: `/${lang}/services` },
    { label: t("header.mortgage"), path: `/${lang}/mortgage` },
    { label: t("header.news"), path: `/${lang}/news` },
    // { label: t("header.sponsors"), path: `/${lang}/sponsors` },
  ];
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const menuRef = useRef<HTMLLIElement | null>(null);
  const closeNav = () => {
    setUserMenuOpen(false);
    onLinkClick();
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = () => setAuthMode("login");

    window.addEventListener("open-login", handler);
    return () => window.removeEventListener("open-login", handler);
  }, []);
  return (
    <>
      <ul style={{ display: "flex", alignItems: "center" }}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={{
                pathname: item.path,
              }}
              className={({ isActive }) => (isActive ? "active" : "nonactive")}
              onClick={() => onLinkClick()}
              end
            >
              {item.label}
            </NavLink>
          </li>
        ))}
        <li className="only-pc-wide">
          <NavLink
            to={`/${lang}/contact`}
            className={({ isActive }) => (isActive ? "activeC" : "nonactiveC")}
            onClick={() => onLinkClick()}
            end
          >
            <Button className="nav-btn">{t("header.contact")}</Button>
          </NavLink>
        </li>

        <li
          ref={menuRef}
          style={{
            position: "relative",
            listStyle: "none",
          }}
        >
          <button
            type="button"
            className={`user-menu-button ${userMenuOpen ? "open" : ""}`}
            onClick={() => setUserMenuOpen((prev) => !prev)}
          >
            <img
              className="user-icon"
              src={user ? LoggedIn : User}
              alt="Uživatelské menu"
              height="20"
              width="20"
            />{" "}
            {t("header.profile")} ▾
          </button>

          {userMenuOpen && (
            <div className="user-dropdown desktop-user-dropdown">
              {!user ? (
                <>
                  <button
                    className="hoverRed "
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setUserMenuOpen(false);
                    }}
                  >
                    {t("login.submit")}
                  </button>

                  <button
                    className="hoverRed "
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setUserMenuOpen(false);
                    }}
                  >
                    {t("register.submit")}
                  </button>
                </>
              ) : (
                <>
                  <ul className="logged-list">
                    <li>
                      <NavLink
                        to={`/${lang}/favorites`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t("auth.favorites")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${lang}/forms`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t("auth.forms")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={`/${lang}/me`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t("auth.settings")}
                      </NavLink>
                    </li>
                  </ul>
                  <button
                    className="hoverRed"
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    {t("auth.logout")}
                  </button>
                </>
              )}
            </div>
          )}
          <div className="mobile-user-menu">
            {!user ? (
              <>
                <button
                  className="hoverRed nav-btn-style"
                  type="button"
                  onClick={() => {
                    closeNav();
                    setAuthMode("login");
                  }}
                >
                  {t("login.submit")}
                </button>

                <button
                  className="hoverRed nav-btn-style"
                  type="button"
                  onClick={() => {
                    closeNav();
                    setAuthMode("register");
                  }}
                >
                  {t("register.submit")}
                </button>
              </>
            ) : (
              <ul className="logged-list">
                <li>
                  <NavLink to={`/${lang}/favorites`} onClick={onLinkClick}>
                    {t("auth.favorites")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/${lang}/forms`} onClick={onLinkClick}>
                    {t("auth.forms")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/${lang}/me`} onClick={onLinkClick}>
                    {t("auth.settings")}
                  </NavLink>
                </li>
                <button
                  className="hoverRed nav-btn-style"
                  type="button"
                  onClick={() => {
                    closeNav();
                    logout();
                  }}
                >
                  {t("auth.logout")}
                </button>
              </ul>
            )}
          </div>
        </li>
        <li className="only-mobile">
          <NavLink
            to={`/${lang}/contact`}
            className={({ isActive }) => (isActive ? "activeC" : "nonactiveC")}
            onClick={() => onLinkClick()}
            end
          >
            <Button className="nav-btn">{t("header.contact")}</Button>
          </NavLink>
        </li>
      </ul>
      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}{" "}
    </>
  );
}
export default Navbar;
