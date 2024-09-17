import React, { memo } from "react";
import titlehoinghi from "../assets/titlehoinghi.png";
import titlecheckin from "../assets/titlecheckin.png";
import checkin from "../assets/contenthoinghi.png";

const ChaoMungComponent = ({ userCurrent }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centers items horizontally
        justifyContent: 'center', // Centers items vertically
        textAlign: 'center',
        width: '100%', // Ensure full width
      }}
    >
      <img
        src={titlehoinghi}
        style={{ width: "70%", marginBottom: "1vh" }} // Adjusted margin for spacing below
        alt="Welcome to the Conference"
      />
      <img
        src={titlecheckin}
        style={{ width: "30%", marginTop: "1vh", marginBottom: "1vh" }} // Added bottom margin for spacing
        alt="Check-in Title"
      />
      <h2
        className="font-large text-white"
        style={{
          textTransform: "uppercase",
          marginTop: "3vh", // Keep margin for spacing above the name
          marginBottom: "1.15vh",
          fontSize: "2.5vw",
          lineHeight: 1.2,
        }}
      >
        {userCurrent?.hovaten || "."}
      </h2>
      <h2
        className="font-large text-white"
        style={{
          textTransform: "uppercase",
          marginBottom: "1.15vh",
          fontSize: "1.75vw",
          lineHeight: 1.2,
        }}
      >
        {userCurrent?.donvi || "."}
      </h2>
      <img
        src={checkin}
        style={{ width: "80%", marginTop: "1vh" }} // Adjust margin as needed
        alt="Check-in illustration"
      />
    </div>
  );
};

export default memo(ChaoMungComponent);