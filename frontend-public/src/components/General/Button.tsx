import React from "react";
import "../../styles/general/button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className: customClassName,
  ...props
}) => {
  const className = [
    "button",
    `button-${variant}`,
    props.disabled ? "button-disabled" : "",
    customClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={className} {...props}>
      {props.children}
    </button>
  );
};

export default Button;
