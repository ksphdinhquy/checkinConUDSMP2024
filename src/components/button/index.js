import React from "react";
import "./index.css";

const Button = ({ text, onClick, style, className, bold, ...props }) => {
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        fontWeight: bold ? "bold" : "normal",
      }}
      className={`button  ${className} `}
      {...props}
    >
      {text}
    </button>
  );
};

export const ButtonLink = ({
  text,
  onClick,
  style,
  className,
  href,
  bold,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
        textDecoration: "none",
        display: "block",
        textAlign: "center",
        fontWeight: bold ? "bold" : "normal",
      }}
      className={`button button-link  ${className} `}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
