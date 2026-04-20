import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function CenteredLayout() {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#C1E6F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
