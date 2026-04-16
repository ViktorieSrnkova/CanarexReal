import { Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { ListingRow } from "../../../types/listings";

type Props = {
  listing: ListingRow;
};

type Lang = "cs" | "en" | "sk";

const LANG_LABEL: Record<Lang, string> = {
  cs: "CZ",
  en: "EN",
  sk: "SK",
};

const renderCheck = (has: boolean, tooltip: string) => (
  <Tooltip title={tooltip}>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        fontSize: 12,
      }}
    >
      {has ? (
        <CheckOutlined style={{ color: "#52c41a" }} />
      ) : (
        <CloseOutlined style={{ color: "#ff4d4f" }} />
      )}
    </span>
  </Tooltip>
);

export function Language({ listing }: Props) {
  const langMap = listing.languages;

  const renderTranslation = (lang: Lang) => {
    const hasContent = langMap[lang];

    return renderCheck(
      hasContent,
      `${LANG_LABEL[lang]} překlad ${hasContent ? "existuje" : "chybí"}`,
    );
  };

  const renderAlt = (lang: Lang) => {
    const hasAlt = listing.image?.hasAlt?.[lang] ?? false;

    return renderCheck(
      hasAlt,
      `${LANG_LABEL[lang]} ALT ${hasAlt ? "existuje" : "chybí"}`,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {renderTranslation("cs")}
        {renderTranslation("en")}
        {renderTranslation("sk")}
        <span style={{ fontSize: 10, color: "#999", width: 28 }}>TXT</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {renderAlt("cs")}
        {renderAlt("en")}
        {renderAlt("sk")}
        <span style={{ fontSize: 10, color: "#999", width: 28 }}>ALT</span>
      </div>
    </div>
  );
}
