/* 
 const formatLocation = (address: string, lang: Lang) => {
    if (!address) return "";

    return address
      .replace(
        /Kanárske ostrovy|Kanárské ostrovy/g,
        {
          cs: "Kanárské ostrovy",
          sk: "Kanárske ostrovy",
          en: "Canary Islands",
        }[lang],
      )
      .replace(
        /Španělsko|Spain/g,
        {
          cs: "Španělsko",
          sk: "Španielsko",
          en: "Spain",
        }[lang],
      );
  };


*/
import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import PropertyPrintTemplate from "./PropertyPrintTemplate";
import type { ListingDetail } from "../../types/listings";

type Language = "cs" | "sk" | "en";

interface PrintPreviewProps {
  listing: ListingDetail;
  images: ListingDetail["obrazky"];
  language: Language;
  onLanguageChange: (language: Language) => void;
}
const A4_WIDTH_PX = 793.7008;

const PrintPreview = ({
  listing,
  images,
  language,
  onLanguageChange,
}: PrintPreviewProps) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = previewContainerRef.current;

    if (!container) return;

    const updateScale = () => {
      const availableWidth = container.clientWidth;

      setScale(Math.min(1, availableWidth / A4_WIDTH_PX));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);
  return (
    <div className="print-preview-container" ref={previewContainerRef}>
      <div className="print-preview-toolbar">
        <span>Jazyk</span>

        <Select<Language>
          value={language}
          onChange={onLanguageChange}
          options={[
            { value: "cs", label: "Čeština" },
            { value: "sk", label: "Slovenština" },
            { value: "en", label: "Angličtina" },
          ]}
          style={{ width: 140 }}
        />
      </div>

      <div
        className="print-preview print-document"
        style={
          {
            "--print-scale": scale,
          } as React.CSSProperties
        }
      >
        <PropertyPrintTemplate
          listing={listing}
          images={images}
          language={language}
        />
      </div>
    </div>
  );
};

export default PrintPreview;
