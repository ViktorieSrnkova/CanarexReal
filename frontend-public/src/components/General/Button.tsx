import React from "react";

type Props = {
  text?: string;
};

const Button: React.FC<Props> = ({ text }) => {
  return <div>{text}</div>;
};

export default Button;
