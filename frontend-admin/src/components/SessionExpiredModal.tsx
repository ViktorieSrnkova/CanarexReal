import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const SessionExpiredModal = () => {
  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  return (
    <Modal
      open={true}
      closable={false}
      mask={{ closable: false }}
      footer={null}
      centered
    >
      <div style={{ textAlign: "center" }}>
        <ExclamationCircleOutlined style={{ fontSize: 40, color: "#faad14" }} />
        <h2>Relace vypršela</h2>
        <p>Kvůli dlouhé nečinnosti jste byl/a odhlášen/a.</p>

        <Button type="primary" onClick={handleLoginRedirect} block>
          Přihlásit se znovu
        </Button>
      </div>
    </Modal>
  );
};

export default SessionExpiredModal;
