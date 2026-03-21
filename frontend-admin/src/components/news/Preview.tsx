import React from "react";
import { Card, Row, Col } from "antd";
import type { Lang, NewsFormState } from "../../types/news"; // Assuming you have a type for data

type Props = {
  languages: Lang[];
  data: NewsFormState & { imagePreview?: string; image?: File }; // include optional image preview
};

const NewsPreview: React.FC<Props> = ({ languages, data }) => {
  const getPreviewText = (jsonStr?: string, maxLength = 150) => {
    if (!jsonStr) return "Žádný obsah";
    try {
      const content = JSON.parse(jsonStr);
      type EditorJSBlock = { type: string; data: { text: string } };
      const blocks = content.blocks as EditorJSBlock[];
      let text = "";
      for (const block of blocks) {
        if (block.type === "paragraph" || block.type === "header") {
          const clean = block.data.text
            .replace(/&nbsp;/g, " ")
            .replace(/<[^>]+>/g, "")
            .trim();
          if (clean) text += clean + " ";
        }
        if (text.length >= maxLength) break;
      }
      text = text.trim();
      return text.length > maxLength
        ? text.slice(0, maxLength).trim() + "..."
        : text || "Žádný obsah";
    } catch {
      return "Chybný obsah";
    }
  };
  return (
    <Row gutter={16} style={{ marginTop: 16 }}>
      {languages.map((lang) => {
        const t = data.translations[lang];
        if (!t && !data.image) return null;

        return (
          <Col span={8} key={lang}>
            <Card title={`Jazyk ${lang.toUpperCase()}`}>
              {t?.title && (
                <p>
                  <strong>Titulek:</strong> {t.title}
                </p>
              )}
              {data.image && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={data.imagePreview}
                    alt={data.altTexts[lang] || "Hlavní obrázek"}
                    style={{ maxWidth: "100%", maxHeight: 150 }}
                  />
                  {data.altTexts[lang] && (
                    <p>
                      <strong>Alt:</strong> {data.altTexts[lang]}
                    </p>
                  )}
                  {t?.text && (
                    <p>
                      <strong>Text:</strong> {getPreviewText(t.text)}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default NewsPreview;
