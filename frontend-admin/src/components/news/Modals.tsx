import { Modal, Input, Button } from "antd";
import EditorMinimal from "../editor/RichMediaEditor";
import type { useNewsForm } from "../../hooks/useNewsForm";

type NewsFormHook = ReturnType<typeof useNewsForm>;

const Modals = (formHook: NewsFormHook) => {
  const {
    titleModal,
    altModal,
    editorModal,
    activeLang,
    titleInput,
    altInput,
    editorRef,
    setTitleInput,
    setAltInput,
    saveTitle,
    saveAltText,
    saveEditorText,
  } = formHook;
  return (
    <>
      <Modal
        title={`Titulek (${activeLang?.toUpperCase()})`}
        open={titleModal}
        onOk={saveTitle}
        onCancel={() => {}}
      >
        <Input
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Zadejte titulek"
        />
      </Modal>

      <Modal
        title={`Alt text (${activeLang?.toUpperCase()})`}
        open={altModal}
        onOk={saveAltText}
        onCancel={() => {}}
      >
        <Input
          value={altInput}
          onChange={(e) => setAltInput(e.target.value)}
          placeholder="Zadejte ALT text"
        />
      </Modal>

      <Modal
        width={900}
        title={`Text (${activeLang?.toUpperCase()})`}
        open={editorModal}
        onCancel={() => {}}
        footer={[
          <Button key="save" type="primary" onClick={saveEditorText}>
            Uložit text
          </Button>,
        ]}
      >
        <EditorMinimal ref={editorRef} />
      </Modal>
    </>
  );
};

export default Modals;
