import React from "react";
import { Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Icon, { PlusOutlined, ToolOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Props = {
  path: string;
  purpose: string;
};

const ActionCard: React.FC<Props> = ({ path, purpose }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/${path}`)}
      style={{
        height: 125,
        minWidth: 250,
        width: "100%",
        border: "1px solid #5fb6d9",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        color: "#5fb6d9",
      }}
    >
      <Icon
        component={path.endsWith("/create") ? PlusOutlined : ToolOutlined}
        style={{ fontSize: 20, marginRight: 12 }}
      />
      <Text strong style={{ fontSize: "17px", color: "#5fb6d9" }}>
        {purpose}
      </Text>
    </Card>
  );
};

export default ActionCard;
