import React from "react";
import { Card, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { FormSummary } from "../../types/forms";
import Icon, {
  CheckCircleOutlined,
  FormOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { formatPhoneNumber } from "../../utils/formatting";

const { Text } = Typography;

interface FormCardProps {
  form: FormSummary;
}

const FormCard: React.FC<FormCardProps> = ({ form }) => {
  const navigate = useNavigate();

  const created = new Date(form.datum_vytvoreni).toLocaleDateString();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/forms/${form.id}`)}
      style={{
        height: "100%",
        opacity: form.revidovano ? 0.6 : 1,
        border: form.revidovano ? "1px solid #52c41a" : undefined,
      }}
    >
      <Icon
        component={UserOutlined}
        style={{ fontSize: 16, marginBottom: 8, marginRight: 8 }}
      />
      <Text strong>
        {form.jmeno} {form.prijmeni}
      </Text>

      <div>
        <Icon
          component={MailOutlined}
          style={{ fontSize: 16, marginBottom: 8, marginRight: 8 }}
        />
        <Text type="secondary">{form.email}</Text>
      </div>

      <div>
        <Icon
          component={PhoneOutlined}
          style={{ fontSize: 16, marginBottom: 8, marginRight: 8 }}
        />
        <Text type="secondary">{formatPhoneNumber(form.telefon)}</Text>
      </div>

      <div
        style={{
          marginTop: 8,
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <Tag color="blue">{form.typy_formulare?.nazev}</Tag>
        <Tag color="purple">{form.odkud_formular?.nazev} </Tag>
      </div>

      <div style={{ marginTop: 12 }}>
        <Icon
          component={FormOutlined}
          style={{ fontSize: 16, marginBottom: 8, marginRight: 8 }}
        />
        <Text>{created}</Text>
      </div>
      <Icon
        component={CheckCircleOutlined}
        style={{
          fontSize: 24,
          color: "#52c41a",
          display: form.revidovano ? "block" : "none",
          position: "absolute",
          top: 12,
          right: 12,
        }}
      />
    </Card>
  );
};

export default FormCard;
