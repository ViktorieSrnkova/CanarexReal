import React from "react";
import { Badge, Card, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

type Props = {
  visibility?: boolean;
  created: string;
  amountNew?: number;
  amountUnprocessed?: number;
  index?: number;
  context: string;
  total?: number;
  name?: string;
  surname?: string;
};

const StatCard: React.FC<Props> = ({
  visibility,
  created,
  amountNew,
  amountUnprocessed,
  index,
  context,
  total,
  name,
  surname,
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
      <Text style={{ fontSize: "14px", display: "block" }}>
        Nejnovější {context}:
      </Text>
      {name && surname && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          {" "}
          {name} {surname}
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

      {amountNew !== undefined && amountNew !== null && amountNew !== 0 && (
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

      {visibility !== undefined && visibility !== null && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Viditelnost:{" "}
          {visibility === true ? (
            <CheckOutlined style={{ color: "green" }} />
          ) : (
            <CloseOutlined style={{ color: "red" }} />
          )}
        </Text>
      )}
      {total && (
        <Text style={{ fontSize: "14px", display: "block" }}>
          Počet celkem: {total}
        </Text>
      )}
    </Card>
  );
};

export default StatCard;
