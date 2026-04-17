import { useEffect, useState } from "react";
import { Row, Col, Spin, Empty, Typography } from "antd";
import { getForms } from "../../api/forms";
import FormCard from "../../components/forms/FormCard";
import type { FormSummary } from "../../types/forms";

const { Title } = Typography;

const ContactFormsPage = () => {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const data = await getForms();
      setForms(data);
    } catch (err) {
      console.error("Forms load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" />;

  if (!forms.length) return <Empty description="No contact forms yet" />;

  return (
    <div>
      <Title level={2}>Formuláře</Title>

      <Row gutter={[16, 16]}>
        {forms.map((form) => (
          <Col xs={24} sm={12} md={12} lg={8} xl={6} key={form.id}>
            <FormCard form={form} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ContactFormsPage;
