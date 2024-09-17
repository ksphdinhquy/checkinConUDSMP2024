import React from "react";

const OverlayWrapper = ({ children }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,.3)",
      }}
    >
      {children}
    </div>
  );
};

export default OverlayWrapper;
