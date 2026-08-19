import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { ListingRow } from "../../../types/listings";

type Props = {
  listing: ListingRow;
};

type Lang = "cs" | "en" | "sk";

const renderCheck = (has: boolean) => (
  <span
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 16,
      height: 16,
      fontSize: 12,
      touchAction: "pan-x",
    }}
  >
    {has ? (
      <CheckOutlined style={{ color: "#52c41a" }} />
    ) : (
      <CloseOutlined style={{ color: "#ff4d4f" }} />
    )}
  </span>
);

export function Language({ listing }: Props) {
  const langMap = listing.languages;

  const renderTranslation = (lang: Lang) => {
    const hasContent = langMap[lang];

    return renderCheck(hasContent);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {renderTranslation("cs")}
        {renderTranslation("en")}
        {renderTranslation("sk")}
      </div>
    </div>
  );
}
