import { Modal, Input } from "antd";
import type { useNewsForm } from "../../hooks/useNewsForm";

type NewsFormHook = ReturnType<typeof useNewsForm>;

const Modals = (formHook: NewsFormHook) => {
  const {
    titleModal,
    altModal,
    activeLang,
    titleInput,
    altInput,
    setTitleInput,
    setAltInput,
    saveTitle,
    saveAltText,
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
          style={{ fontSize: "16px" }}
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
          style={{ fontSize: "16px" }}
        />
      </Modal>
    </>
  );
};

export default Modals;
