import React, { useEffect, useRef } from "react";
import { Form, Button, Radio, Typography, Upload, Row, Col } from "antd";
import type { Lang, NewsAdminItem } from "../../types/news";
import { useNewsForm } from "../../hooks/useNewsForm";
import Modals from "../../components/news/Modals";
import LangButtonGroup from "../../components/news/Buttons";
import NewsPreview from "../../components/news/Preview";
import { mapNewsToTranslations } from "../../utils/newsMapper";

const { Title } = Typography;
const languages: Lang[] = ["cs", "en", "sk"];

type Props = {
  initialData?: NewsAdminItem;
  onSuccess?: () => void;
};

const NewsCreatePage: React.FC<Props> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const formHook = useNewsForm(initialData?.id, onSuccess);
  const initializedRef = useRef(false);
  useEffect(() => {
    console.log("🟢 initialData (RAW FROM API):", initialData);
    if (!initialData) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    const translations = mapNewsToTranslations(initialData);

    const image = initialData.obrazky?.find((img) => img.poradi === 0);
    const API_URL = import.meta.env.VITE_API_URL;

    formHook.setData((prev) => ({
      ...prev,
      translations,
      visible: initialData.viditelnost,
      existingImageId: image?.id,
      existingImageUrl: image
        ? `${API_URL}/api/files/images/${image.id}`
        : undefined,
    }));
    form.setFieldsValue({
      visible: initialData.viditelnost,
    });
  }, [initialData]);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Vytvořit aktualitu</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => formHook.submitNews(values, form.resetFields)}
        style={{ maxWidth: 900 }}
      >
        <Row gutter={16} wrap>
          <Col xs={24} lg={17}>
            <Form.Item label="Titulky">
              <LangButtonGroup
                languages={languages}
                getValue={(lang) => formHook.data.translations[lang]?.title}
                label="Titulek"
                onClick={(lang) => formHook.openModal("title", lang)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={7}>
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

        <Row gutter={16} wrap>
          <Col xs={24} lg={5}>
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

          <Col xs={24} lg={12}>
            <Form.Item label="Alt texty obrázku">
              <LangButtonGroup
                languages={languages}
                getValue={(lang) => formHook.data.translations[lang]?.alt}
                label="ALT"
                onClick={(lang) => formHook.openModal("alt", lang)}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item label="Text aktuality">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <LangButtonGroup
                  languages={languages}
                  getValue={(lang) => formHook.data.translations[lang]?.text}
                  label="Text"
                  onClick={(lang) => formHook.openModal("editor", lang)}
                />
              </div>
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
