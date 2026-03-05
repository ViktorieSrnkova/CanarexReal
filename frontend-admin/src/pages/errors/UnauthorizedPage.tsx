import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 50 }}>
      <h1>403 - Nemáš přístup</h1>

      <Button type="primary" onClick={() => navigate("/")}>
        Jít na dashboard
      </Button>
    </div>
  );
}
