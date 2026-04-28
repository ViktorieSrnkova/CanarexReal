import React, { useState } from "react";
import EditorRendererWrapper from "../Editor/EditorRendererWrapper";
import { useT } from "../../i18n";
import "../../styles/listing/expendableDescription.css";
import Button from "../General/Button";

type Props = {
  content: string;
};

export const ExpandableDescription: React.FC<Props> = ({ content }) => {
  const t = useT();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="description-wrapper">
      <h3>{t("listing.description")}</h3>

      <div className={expanded ? "det-content expanded" : "det-content"}>
        <EditorRendererWrapper data={content} />
      </div>
      <div
        className="det-btn-group"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded && <div className="arrow arrow-up"></div>}
        <Button className="det-toggle-btn">
          {expanded ? t("listing.expanded") : t("listing.collapsed")}
        </Button>
        {!expanded && <div className="arrow arrow-down"></div>}
      </div>
    </div>
  );
};
