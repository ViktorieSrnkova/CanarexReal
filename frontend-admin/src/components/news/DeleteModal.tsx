import { Modal } from "antd";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirmModal: React.FC<Props> = ({ open, onConfirm, onCancel }) => {
  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Smazat"
      cancelText="Zrušit"
      okButtonProps={{ danger: true }}
      centered
    >
      Opravdu chceš smazat tuto aktualitu?
    </Modal>
  );
};

export default DeleteConfirmModal;
