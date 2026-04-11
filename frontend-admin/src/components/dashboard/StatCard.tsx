import React from "react";
import { Badge, Card, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Props = {
  visibility?: boolean;
  created: string;
  title: string;
  amountNew?: number;
  amountUnprocessed?: number;
  index?: number;
};

const StatCard: React.FC<Props> = ({
  visibility,
  created,
  title,
  amountNew,
  amountUnprocessed,
  index,
}) => {
  return (
    <Card
      style={{
        height: 125,
        width: "100%",
        minWidth: 250,
        border: "1px solid #0000002c",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {title && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Nejnovější: {title}
        </Text>
      )}
      {index && (
        <Text style={{ fontSize: "14px", display: "block" }}>ID: {index}</Text>
      )}
      {created && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Vytvořeno: {new Date(created).toLocaleDateString("cs-CZ")}
        </Text>
      )}
      {amountNew !== undefined && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Počet nových:{" "}
          <Badge count={amountNew} style={{ backgroundColor: "#0ac20e" }} />
        </Text>
      )}
      {amountUnprocessed !== undefined && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Nezpracovaných celkem:{" "}
          <Text type="danger" strong>
            {amountUnprocessed}
          </Text>
        </Text>
      )}
      {visibility && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Viditelnost:{" "}
          {visibility === true ? (
            <CheckOutlined style={{ color: "green" }} />
          ) : (
            <CloseOutlined style={{ color: "red" }} />
          )}
        </Text>
      )}
    </Card>
  );
};

export default StatCard;
