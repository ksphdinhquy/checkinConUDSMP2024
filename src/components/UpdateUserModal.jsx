import { Modal } from "antd";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

const initState = {
  hovaten: "",
  donvi: "",
  sodienthoai: "",
  email: "",
  room: "", // Thêm trường room
};

const UpdateUserModal = ({ modalIsOpen, setIsOpen, initForm }) => {
  const [form, setForm] = useState(initState);
  const [rooms, setRooms] = useState([]); // State để lưu danh sách phòng

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Hàm xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = { ...form };
    for (const key in updatedForm) {
      if (!updatedForm[key]) {
        delete updatedForm[key];
      }
    }

    const usersRef = doc(db, "daibieu", form.id); // Sửa thành "daibieu"

    try {
      await setDoc(usersRef, updatedForm);
      toast.success("Cập nhật thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Cập nhật thất bại!", {
        position: "top-right",
      });
    } finally {
      setIsOpen(false);
      setForm(initState);
    }
  };

  // Lấy danh sách phòng từ Firestore
  const fetchRooms = async () => {
    const roomsCollection = collection(db, "room");
    const roomSnapshot = await getDocs(roomsCollection);
    const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRooms(roomList);
  };

  // Cập nhật form khi có dữ liệu khởi tạo
  useEffect(() => {
    if (initForm) {
      setForm(initForm);
    }
    fetchRooms(); // Gọi hàm lấy dữ liệu phòng khi modal mở
  }, [initForm]);

  return (
    <Modal
      title="Cập nhật thông tin đại biểu"
      centered
      open={modalIsOpen}
      onCancel={() => {
        setForm(initState);
        setIsOpen(false);
      }}
      footer={null}
    >
      <form onSubmit={handleSubmit}>
        {Object.keys(initState).map((key) => (
          <div key={key}>
            <p className="mb-0 mt-2">{key === "hovaten" ? "Họ và tên" : key}</p>
            {key === "room" ? ( // Thêm trường select cho room
              <select
                className="form-control"
                name="room"
                value={form.room || ""} // Đảm bảo giá trị mặc định là string rỗng
                onChange={handleChange}
                required
              >
                <option value="">Chọn phòng</option> {/* Hiển thị thông báo "Chọn phòng" */}
                {rooms.map(room => (
                  <option key={room.id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="form-control"
                type={key === "sodienthoai" ? "tel" : "text"}
                placeholder={key === "hovaten" ? "Họ và tên" : ""}
                onChange={handleChange}
                name={key}
                value={form[key]}
                required
              />
            )}
          </div>
        ))}
        <div
          className="d-flex align-items-center"
          style={{ marginTop: "1rem", justifyContent: "flex-end" }}
        >
          <button type="submit" className="btn btn-primary text-white">
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default memo(UpdateUserModal);