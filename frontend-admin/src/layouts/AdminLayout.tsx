import { Button, Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import {
  FolderOpenOutlined,
  HomeOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReadOutlined,
  SolutionOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import React, { useRef, useState } from "react";
import axios from "axios";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const checkingAuth = useRef(false);
  const lastAuthCheck = useRef(Date.now());

  const AUTH_CHECK_INTERVAL = 60 * 1000;
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const selectedKey = (() => {
    if (path === "/") return "1";
    if (path.startsWith("/listings/create")) return "2-2";
    if (path.startsWith("/listings")) return "2-1";
    if (path.startsWith("/news/create")) return "3-2";
    if (path.startsWith("/news")) return "3-1";
    if (path.startsWith("/forms")) return "4";
    if (path.startsWith("/print")) return "5";
    return "1";
  })();

  React.useEffect(() => {
    if (window.innerWidth < 992) return;
    const keys: string[] = [];

    if (path.startsWith("/listings")) keys.push("2");
    if (path.startsWith("/news")) keys.push("3");

    setOpenKeys(keys);
  }, [path]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const checkAuth = async (): Promise<boolean> => {
    const now = Date.now();

    if (now - lastAuthCheck.current < AUTH_CHECK_INTERVAL) {
      return true;
    }

    if (checkingAuth.current) {
      return false;
    }

    checkingAuth.current = true;

    try {
      await axios.get(`${VITE_API_URL}/api/admin/session/check`, {
        withCredentials: true,
      });

      lastAuthCheck.current = Date.now();
      console.log("didnt catch");
      return true;
    } catch {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      console.log("did catch");
      navigate("/login", { replace: true });
      return false;
    } finally {
      checkingAuth.current = false;
    }
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
        marginLeft: window.innerWidth < 992 ? 0 : 250,
      }}
      onClick={() => {
        void checkAuth();
      }}
    >
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
          left: 0,
          top: 0,
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={[
            {
              key: "1",
              label: (
                <Link to="/">
                  <HomeOutlined /> Domů
                </Link>
              ),
            },
            {
              key: "2",
              label: (
                <label
                  style={{
                    color: path.startsWith("/listings") ? "#5fb6d9" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  <FolderOpenOutlined /> Inzeráty
                </label>
              ),
              children: [
                {
                  key: "2-1",
                  label: (
                    <Link to="/listings">
                      <ToolOutlined /> Spravovat inzeráty
                    </Link>
                  ),
                },
                {
                  key: "2-2",
                  label: (
                    <Link to="/listings/create">
                      <PlusOutlined /> Vytvořit inzerát
                    </Link>
                  ),
                },
              ],
            },
            {
              key: "3",
              label: (
                <label
                  style={{
                    color: path.startsWith("/news") ? "#5fb6d9" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  <ReadOutlined /> Aktuality
                </label>
              ),
              children: [
                {
                  key: "3-1",
                  label: (
                    <Link to="/news">
                      <ToolOutlined /> Spravovat aktuality
                    </Link>
                  ),
                },
                {
                  key: "3-2",
                  label: (
                    <Link to="/news/create">
                      <PlusOutlined /> Vytvořit aktuality
                    </Link>
                  ),
                },
              ],
            },
            {
              key: "4",
              label: (
                <Link to="/forms">
                  <SolutionOutlined /> Formuláře
                </Link>
              ),
            },
            {
              key: "5",
              label: (
                <Link to="/print">
                  <PrinterOutlined /> Tisk Inzerátu
                </Link>
              ),
            },
          ]}
          onClick={() => {
            if (window.innerWidth < 992) {
              setCollapsed(true);
            }
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Admin panel</div>
          <Button danger onClick={handleLogout}>
            Odhlásit se
          </Button>
        </Header>
        <Content
          style={{
            padding: window.innerWidth < 768 ? 12 : 24,
            paddingTop: window.innerWidth < 768 ? 32 : 24,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
