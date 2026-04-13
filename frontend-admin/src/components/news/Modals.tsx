import { Modal, Input, Button } from "antd";
import EditorMinimal from "../editor/RichMediaEditor";
import type { useNewsForm } from "../../hooks/useNewsFormOG";
import { fullEditorTools } from "../../config/editor-tools";

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
    setEditorReady,
  } = formHook;
  return (
    <>
      <Modal
        title={`Titulek (${activeLang?.toUpperCase()})`}
        open={titleModal}
        onOk={saveTitle}
        onCancel={formHook.closeTitleModal}
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
        onCancel={formHook.closeAltModal}
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
        onCancel={formHook.closeEditorModal}
        footer={[
          <Button key="save" type="primary" onClick={saveEditorText}>
            Uložit text
          </Button>,
        ]}
      >
        <EditorMinimal
          id="full-editor"
          tools={fullEditorTools}
          ref={editorRef}
          onReady={() => setEditorReady(true)}
        />
      </Modal>
    </>
  );
};

export default Modals;
