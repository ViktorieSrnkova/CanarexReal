import React from "react";
import { Card, Row, Col } from "antd";
import type { Lang, NewsFormState } from "../../types/news";

type Props = {
  languages: Lang[];
  data: NewsFormState & { imagePreview?: string; mainImage?: File };
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
        : text || "Žádný text ale je tam obrázek";
    } catch {
      return "Chybný obsah";
    }
  };
  return (
    <Row gutter={16} style={{ marginTop: 16 }}>
      {languages.map((lang) => {
        const t = data.translations[lang];
        const hasContent = Boolean(
          t?.title?.trim() || t?.text?.trim() || data.altTexts[lang]?.trim(),
        );
        const imageSrc = data.mainImage
          ? data.imagePreview
          : data.existingImageUrl;

        if (!hasContent) return null;

        return (
          <Col span={8} key={lang}>
            <Card title={`${lang.toUpperCase()}`}>
              {t?.title && (
                <p>
                  <strong>Titulek:</strong> {t.title}
                </p>
              )}

              {imageSrc && hasContent && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={data.imagePreview ?? data.existingImageUrl}
                    alt={data.altTexts[lang] || "Hlavní obrázek"}
                    style={{ maxWidth: "100%", maxHeight: 150 }}
                  />
                </div>
              )}
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
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default NewsPreview;
