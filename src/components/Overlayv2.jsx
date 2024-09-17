import React from "react";

const OverlayV2 = ({ children, visiable }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,.8)",
        display: visiable ? "block" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default OverlayV2;
