import { Modal } from "antd";
import type { ReactNode } from "react";

type Props<T> = {
  open: boolean;
  onClose: () => void;
  initialData: T | null;
  onSuccess?: () => void;
  children: (args: { data: T; onSuccess?: () => void }) => ReactNode;
};

export function EditModal<T>({
  open,
  onClose,
  initialData,
  onSuccess,
  children,
}: Props<T>) {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width={1000}
      destroyOnHidden={true}
    >
      {open && initialData && children({ data: initialData, onSuccess })}{" "}
    </Modal>
  );
}
