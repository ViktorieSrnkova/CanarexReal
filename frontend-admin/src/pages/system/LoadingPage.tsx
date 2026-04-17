import { Spin } from "antd";

const LoadingPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
};
export default LoadingPage;
