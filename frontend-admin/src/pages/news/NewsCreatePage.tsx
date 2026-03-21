import React from "react";
import { Form, Button, Radio, Typography, Upload, Row, Col } from "antd";
import type { Lang } from "../../types/news";
import { useNewsForm } from "../../hooks/useNewsForm";
import Modals from "../../components/news/Modals";
import LangButtonGroup from "../../components/news/Buttons";
import NewsPreview from "../../components/news/Preview";

const { Title } = Typography;
const languages: Lang[] = ["cs", "en", "sk"];

const NewsCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const formHook = useNewsForm();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Vytvořit aktualitu</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => formHook.submitNews(values, form.resetFields)}
        style={{ maxWidth: 900 }}
      >
        <Row gutter={16}>
          <Col span={15}>
            <Form.Item label="Titulky">
              <LangButtonGroup
                languages={languages}
                getValue={(lang) => formHook.data.translations[lang]?.title}
                label="Titulek"
                onClick={(lang) => formHook.openModal("title", lang)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Viditelnost"
              name="visible"
              rules={[{ required: true, message: "Vyberte viditelnost" }]}
            >
              <Radio.Group>
                <Radio value={true}>Viditelné</Radio>
                <Radio value={false}>Neviditelné</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={5}>
            <Form.Item label="Hlavní obrázek">
              <Upload
                beforeUpload={formHook.handleImageUpload}
                maxCount={1}
                showUploadList={false}
                onChange={({ file }) => {
                  if (file.status === "removed" || file.status === "error") {
                    formHook.handleImageCancel();
                  }
                }}
              >
                <Button
                  onClick={formHook.handleImageClick}
                  loading={formHook.pickingImage || formHook.uploading}
                >
                  {formHook.pickingImage || formHook.uploading
                    ? "Nahrávání..."
                    : "Nahrát obrázek"}
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item label="Alt texty obrázku">
              <LangButtonGroup
                languages={languages}
                getValue={(lang) => formHook.data.altTexts[lang]}
                label="ALT"
                onClick={(lang) => formHook.openModal("alt", lang)}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Text aktuality">
              <LangButtonGroup
                languages={languages}
                getValue={(lang) => formHook.data.translations[lang]?.text}
                label="Text"
                onClick={(lang) => formHook.openModal("editor", lang)}
              />
            </Form.Item>
          </Col>
        </Row>

        <NewsPreview languages={languages} data={formHook.data} />

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">
            Uložit aktualitu
          </Button>
        </Form.Item>
      </Form>

      <Modals {...formHook} />
    </div>
  );
};

export default NewsCreatePage;
