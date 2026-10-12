import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Button,
  Radio,
  Typography,
  Upload,
  Tabs,
  Input,
  message,
} from "antd";
import {
  emptyEditorContent,
  emptyNewsFormValues,
  type NewsAdminItem,
  type NewsEditorContent,
  type NewsFormValues,
} from "../../types/news";
import { useNewsForm } from "../../hooks/useNewsForm";
import RichTextEditor from "../../components/editor/RichTextEditor";
import {
  mapNewsToEditorContent,
  mapNewsToFormValues,
} from "../../utils/newsMapper";
import type { Language } from "../../types/general";
import { postNews, putAdminNews } from "../../api/news";
import "../../styles/form.css";

const { Title } = Typography;
const languages: Language[] = ["cs", "en", "sk"];

type Props = {
  initialData?: NewsAdminItem;
  onSuccess?: () => void;
};

const NewsCreatePage: React.FC<Props> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm<NewsFormValues>();
  const formHook = useNewsForm();
  const initializedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<Language>("cs");
  const [editorContent, setEditorContent] =
    useState<NewsEditorContent>(emptyEditorContent);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!initialData || initializedRef.current) return;

    initializedRef.current = true;

    const formValues = mapNewsToFormValues(initialData);
    const editorValues = mapNewsToEditorContent(initialData);
    console.log("FORM VALUES", formValues);
    form.setFieldsValue(formValues);
    setEditorContent(editorValues);
    console.log("EDITOR VALUES", editorValues);

    const image = initialData.obrazky?.find((img) => img.poradi === 0);
    if (image) {
      formHook.setData((prev) => ({
        ...prev,
        existingImageId: image.id,
        existingImageUrl: `${import.meta.env.VITE_API_URL}/api/files/images/${image.id}`,
      }));
    }
  }, [initialData, form, formHook]);

  const handleSubmit = async (values: NewsFormValues) => {
    setLoading(true);
    const payload = formHook.createPayload(values, editorContent);
    console.log("=== NEWS PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    try {
      if (initialData) {
        await putAdminNews(initialData.id, payload);
        message.success("Zajímavost upravena");
      } else {
        await postNews(payload);
        message.success("Zajímavost vytvořena");
      }
      form.resetFields();
      setEditorContent(emptyEditorContent);
      formHook.resetImage();
      setActiveTab("cs");

      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof Error) message.error(error.message);
      else message.error("Chyba při ukládání aktuality");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ padding: 24, maxWidth: 1150, margin: "0 auto" }}>
      <Title level={2}>
        {initialData ? "Upravit zajímavost" : "Vytvořit zajímavost"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={emptyNewsFormValues}
        onFinish={handleSubmit}
      >
        <div
          className="row-form"
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 160,
            flexWrap: "wrap",
            height: 100,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
          <div
            className="image-upload-preview"
            style={{
              display: "flex",
              flexDirection: "row",
              columnGap: 16,
              flexWrap: "wrap",
              alignItems: "center",
              height: 100,
            }}
          >
            <Form.Item required label="Hlavní obrázek">
              <Upload
                accept="image/*"
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
                  loading={formHook.data.uploading}
                >
                  {formHook.data.uploading ? "Nahrávání..." : "Nahrát obrázek"}
                </Button>
              </Upload>
            </Form.Item>

            {formHook.data.imagePreview || formHook.data.existingImageUrl ? (
              <div style={{ marginTop: 0 }}>
                <img
                  src={
                    formHook.data.imagePreview ?? formHook.data.existingImageUrl
                  }
                  alt="Náhled hlavního obrázku"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    maxWidth: 400,
                    maxHeight: 100,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </div>
            ) : (
              <div className="image-space"></div>
            )}
          </div>
        </div>
        <Form.Item label="Texty zajímavosti" required>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as Language)}
              type="card"
              destroyOnHidden={false}
              tabBarStyle={{
                borderBottom: "1px solid #1890ff",
              }}
              style={{
                backgroundColor: "#c7f1f765",
                padding: 20,
                borderRadius: 8,
                width: "100%",
              }}
              items={languages.map((lang) => ({
                key: lang,
                label: lang.toUpperCase(),
                children: (
                  <>
                    <Form.Item
                      name={["translations", lang, "title"]}
                      label="Název zajímavosti"
                    >
                      <Input style={{ fontSize: "16px" }} />
                    </Form.Item>

                    <Form.Item
                      name={["translations", lang, "alt"]}
                      label="Alt text obrázku"
                    >
                      <Input style={{ fontSize: "16px" }} />
                    </Form.Item>

                    <Form.Item label="Popis">
                      <RichTextEditor
                        version="full"
                        content={editorContent[lang]}
                        onChange={(content) => {
                          setEditorContent((prev) => ({
                            ...prev,
                            [lang]: content,
                          }));
                        }}
                      />
                    </Form.Item>
                  </>
                ),
              }))}
            />
          </div>
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Uložit zajímavost
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewsCreatePage;
