import React, { useEffect } from "react";
import Confettiful from "../utils";
import "./styles/congratulation.css";

const CongratulationOverlay = ({ children }) => {
  useEffect(() => {
    window.confettiful = new Confettiful(
      document.querySelector(".js-congratulationOverlay-container")
    );
  }, []);
  return (
    <>
      <div
        className="js-congratulationOverlay-container congratulationOverlay-container"
        style={{ top: "0px !important" }}
      />
      {children}
    </>
  );
};

export default CongratulationOverlay;
