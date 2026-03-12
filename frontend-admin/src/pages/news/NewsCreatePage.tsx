// src/pages/NewsCreatePage.tsx
import React from "react";
import EditorMinimal from "../../components/editor/RichMediaEditor";

const NewsCreatePage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Create News</h2>
      <EditorMinimal />
    </div>
  );
};

export default NewsCreatePage;
