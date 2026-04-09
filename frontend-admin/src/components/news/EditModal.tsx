import { Modal } from "antd";
import NewsCreatePage from "../../pages/news/NewsCreatePage";
import type { NewsAdminItem } from "../../types/news";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: NewsAdminItem | null;
};

const EditNewsModal: React.FC<Props> = ({ open, onClose, initialData }) => {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={1000}
      destroyOnHidden={true}
      centered
    >
      {initialData && <NewsCreatePage initialData={initialData} />}
    </Modal>
  );
};

export default EditNewsModal;
