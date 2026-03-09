import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

const { Title } = Typography;
type FieldType = {
  username?: string;
  password?: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const res = await api.post("/login", {
        email: values.username,
        password: values.password,
      });
      const token = res.data.accessToken;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      message.success("Přihlášení úspěšné");
      navigate("/");
    } catch {
      message.error("Neplatné přihlašovací údaje");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        paddingInline: 150,
        paddingTop: "calc(50% - 195px)",
        backgroundColor: "#efefef",
        height: "100vh",
      }}
    >
      <Title level={2} style={{ marginBottom: 50 }}>
        Přihlášení do administrace
      </Title>
      <Form
        name="login"
        style={{ maxWidth: 400, margin: "0 auto" }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          layout="vertical"
          label="E-mail:"
          name="username"
          rules={[
            { required: true, message: "Zadejte svůj přihlašovací e-mail!" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="E-mail" />
        </Form.Item>

        <Form.Item<FieldType>
          layout="vertical"
          label="Heslo:"
          name="password"
          rules={[{ required: true, message: "Zadejte své heslo!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Heslo"
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Přihlásit se
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
