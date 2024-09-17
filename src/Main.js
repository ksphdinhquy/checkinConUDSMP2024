import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Mobile from "./Mobile";
import ChaoMung from "./ChaoMung";
import ListCheckIn from "./ListCheckIn";
import QuaySo from "./QuaySo";
import UserMage from "./UserMage";
import Checkin from "./Checkin";
import Diemdanh from "./DiemDanh";
import Dangky from "./DangKy";
import SoDoHoiNghi from "./SoDoHoiNghi";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/mobile" element={<Mobile />} />
        <Route path="/check-in" element={<App />} />
        <Route path="/diem-danh" element={<Diemdanh />} />
        <Route path="/dang-ky" element={<Dangky />} />
        <Route path="/so-do-hoi-nghi" element={<SoDoHoiNghi />} />
        <Route path="/thong-ke" element={<ListCheckIn />} />
        <Route path="/quay-so" element={<QuaySo />} />
        <Route path="/quan-ly" element={<UserMage />} />
        <Route path="/chao-mung" element={<ChaoMung />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Main;
