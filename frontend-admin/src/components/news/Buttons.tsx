import React from "react";
import { Button } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import type { Lang } from "../../types/news";

type Props = {
  languages: Lang[];
  getValue: (lang: Lang) => string | undefined;
  label: string;
  onClick: (lang: Lang) => void;
};

const LangButtonGroup: React.FC<Props> = ({
  languages,
  getValue,
  label,
  onClick,
}) => {
  const renderLangButton = (lang: Lang) => {
    const value = getValue(lang);
    const hasValue = !!value;

    const isSecondaryLang = lang === "en" || lang === "sk";

    let borderColor: string | undefined;
    let color: string | undefined;

    if (hasValue) {
      borderColor = "#52c41a";
      color = "#52c41a";
    } else if (!isSecondaryLang) {
      borderColor = "#1890ff";
      color = "#1890ff";
    } else if (isSecondaryLang) {
      borderColor = "#188fff8b";
      color = "#188fffdd";
    }

    return (
      <Button
        key={lang}
        onClick={() => onClick(lang)}
        icon={hasValue ? <EditOutlined /> : <PlusOutlined />}
        style={{
          borderColor,
          color,
          fontWeight: hasValue ? "bold" : "normal",
        }}
      >
        {label} {lang.toUpperCase()}
      </Button>
    );
  };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {languages.map(renderLangButton)}
    </div>
  );
};

export default LangButtonGroup;
