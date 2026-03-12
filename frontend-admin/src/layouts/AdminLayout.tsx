import { Button, Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import {
  FolderOpenOutlined,
  HomeOutlined,
  PlusOutlined,
  ReadOutlined,
  SolutionOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
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
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250}>
        <Menu
          theme="dark"
          mode="inline"
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
          ]}
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
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
