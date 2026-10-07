import React from "react";
import { Card } from "antd";
import type { JSONContent } from "@tiptap/react";
import type { Lang, NewsFormState } from "../../types/news";

type Props = {
  languages: Lang[];
  data: NewsFormState;
};

const getTiptapText = (node: JSONContent): string => {
  if (node.type === "text") {
    return node.text ?? "";
  }

  return node.content?.map((child) => getTiptapText(child)).join(" ") ?? "";
};

const getPreviewText = (
  content: JSONContent | null | undefined,
  maxLength = 150,
): string => {
  if (!content) {
    return "Žádný obsah";
  }

  const text = getTiptapText(content).replace(/\s+/g, " ").trim();

  if (!text) {
    return "Žádný text ale je tam obrázek";
  }

  return text.length > maxLength
    ? `${text.slice(0, maxLength).trim()}...`
    : text;
};

const NewsPreview: React.FC<Props> = ({ languages, data }) => {
  const imageSrc = data.imagePreview ?? data.existingImageUrl;

  return (
    <div
      style={{
        marginTop: 16,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      {languages.map((lang) => {
        const t = data.translations[lang];

        const textPreview = getPreviewText(t?.text);

        const hasContent = Boolean(
          t?.title?.trim() ||
          t?.alt?.trim() ||
          (t?.text && getTiptapText(t.text).trim()),
        );

        if (!hasContent) {
          return null;
        }

        return (
          <div key={lang}>
            <Card title={lang.toUpperCase()} style={{ maxWidth: "265px" }}>
              {t?.title?.trim() && (
                <p>
                  <strong>Titulek:</strong> {t.title}
                </p>
              )}

              {imageSrc && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={imageSrc}
                    alt={t.alt?.trim() || "Hlavní obrázek"}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 150,
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {t?.alt?.trim() && (
                <p>
                  <strong>Alt:</strong> {t.alt}
                </p>
              )}

              {t?.text && (
                <p>
                  <strong>Text:</strong> {textPreview}
                </p>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default NewsPreview;
