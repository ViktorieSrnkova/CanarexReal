import { Button, Layout, Menu } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { api } from "../api/client";

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();

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
      <Sider>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: "1",
              label: <Link to="/">Domů</Link>,
            },
            {
              key: "2",
              label: <Link to="/listings">Inzeráty</Link>,
            },
            {
              key: "3",
              label: <Link to="/news">Aktuality</Link>,
            },
            {
              key: "4",
              label: <Link to="/forms">Formuláře</Link>,
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
