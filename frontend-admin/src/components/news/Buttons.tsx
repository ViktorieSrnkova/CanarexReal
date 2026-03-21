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
    return (
      <Button
        key={lang}
        onClick={() => onClick(lang)}
        icon={hasValue ? <EditOutlined /> : <PlusOutlined />}
      >
        {label} {lang.toUpperCase()}
      </Button>
    );
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {languages.map(renderLangButton)}
    </div>
  );
};

export default LangButtonGroup;
