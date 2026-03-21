import React from "react";
import { Form, Button, Radio, Typography, Upload } from "antd";
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
        <LangButtonGroup
          languages={languages}
          getValue={(lang) => formHook.data.translations[lang]?.title}
          label="Titulek"
          onClick={(lang) => formHook.openModal("title", lang)}
        />

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

        <Form.Item label="Hlavní obrázek">
          <Upload
            beforeUpload={formHook.handleImageUpload}
            maxCount={1}
            showUploadList={false}
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

        <LangButtonGroup
          languages={languages}
          getValue={(lang) => formHook.data.altTexts[lang]}
          label="ALT"
          onClick={(lang) => formHook.openModal("alt", lang)}
        />

        <LangButtonGroup
          languages={languages}
          getValue={(lang) => formHook.data.translations[lang]?.text}
          label="Text"
          onClick={(lang) => formHook.openModal("editor", lang)}
        />

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
