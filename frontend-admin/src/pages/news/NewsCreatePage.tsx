import React, { useEffect, useRef } from "react";
import { Form, Button, Radio, Typography, Upload, Row, Col } from "antd";
import type { Lang, NewsAdminItem } from "../../types/news";
import { useNewsForm } from "../../hooks/useNewsForm";
import Modals from "../../components/news/Modals";
import LangButtonGroup from "../../components/news/Buttons";
import NewsPreview from "../../components/news/Preview";

const { Title } = Typography;
const languages: Lang[] = ["cs", "en", "sk"];

type Props = {
  initialData?: NewsAdminItem;
};

const NewsCreatePage: React.FC<Props> = ({ initialData }) => {
  const [form] = Form.useForm();
  const formHook = useNewsForm();
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initialData) return;
    if (initializedRef.current) return;

    initializedRef.current = true;
    // visibility
    form.setFieldsValue({
      visible: initialData.viditelnost,
    });

    // translations
    const translations = { ...formHook.data.translations };
    const altTexts = { ...formHook.data.altTexts };

    initialData.aktuality_preklady.forEach((t) => {
      let lang: Lang | undefined;

      if (t.jazyky_id === 2) lang = "cs";
      if (t.jazyky_id === 1) lang = "en";
      if (t.jazyky_id === 3) lang = "sk";

      if (!lang) return;

      translations[lang] = {
        title: t.titulek ?? undefined,
        text: t.text ?? undefined,
      };
    });

    // alt texts (pokud je máš z backendu jinak, upravíš mapping)
    initialData.obrazky?.forEach((img) => {
      languages.forEach((lang) => {
        altTexts[lang] = img.alt ?? "";
      });
    });

    formHook.setData({
      ...formHook.data,
      translations,
      altTexts,
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
