import React from "react";

const CommonBottom = ({ listAttend, showAttend, styleRight }) => {
  return (
    <div
      className="position-absolute w-100"
      style={{
        bottom: "1.5vh",
      }}
    >
      <div className="text-center">
        {showAttend && (
          <h1 className="border-text-blue font-large text-blue mb-1  ">
            TỔNG SỐ ĐẠI BIỂU THAM DỰ :{" "}
            {new Set(listAttend.map((l) => l.qrcode)).size}
          </h1>
        )}

        <div className="d-flex">
          <p
            style={{
              width: "37.5vw",
              lineHeight: 1.2,
              ...styleRight,
            }}
            className="border-text-blue  text-blue m-auto ps-3"
          >
            Bản quyền thuộc về Thành Đoàn Đà Nẵng. <br /> Thiết kế và xây dựng:
            Đoàn viên Ngọc Khánh - Đình Quý - Tuấn Ngọc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommonBottom;
