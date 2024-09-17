import { Modal } from "antd";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";

const SubCreateUserModal = ({ modalIsOpen, setIsOpen }) => {
  const [form, setForm] = useState({
    userImg: "",
    name: "",

    qrcode: "",
  });

  const [units, setUnits] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form) return;
    const { name, unit, qrcode, userImg } = form;
    if (name.length === 0 || qrcode.length === 0 || userImg.length === "") {
      return toast.error("Nhập đầy đủ thông tin !");
    }
    const usersRef = doc(db, "users", uuidv4());
    setDoc(usersRef, {
      userImg,
      name,
      unit,
      qrcode,
    });
    toast.success("Thêm mới thành công !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setForm({
      name: "",
      unit: units[0],
      qrcode: "",
      userImg: "",
    });
  };

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, "units"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data().value);
      });
      data.sort((a, b) => a.localeCompare(b));
      setUnits(data);
      setForm({ unit: data[0] });
    })();
  }, []);

  return (
    <Modal
      title="Tạo đại biểu mới"
      centered
      open={modalIsOpen}
      onCancel={() => setIsOpen(false)}
      footer={[]}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <p className="mb-0 mt-2">Tên </p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            name="name"
            value={form?.name}
          />
          <p className="mb-0 mt-2">Đơn vị </p>
          <select
            className="form-select"
            value={form?.unit}
            name="unit"
            onChange={handleChange}
          >
            {units.map((t) => (
              <option value={t} key={t}>
                {t}
              </option>
            ))}
          </select>

          <p className="mb-0 mt-2">QR code </p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            name="qrcode"
            value={form?.qrcode}
          />

          <p className="mb-0 mt-2">Ảnh </p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            name="userImg"
            value={form?.userImg}
          />
          {/* {file && (
            <img
              style={{
                maxHeight: "35vh",
                objectFit: "cover",
              }}
              src={URL.createObjectURL(file)}
              className="w-100 mt-2 mb-2"
              alt=""
            />
          )} */}

          <div
            className="d-flex align-items-center"
            style={{
              marginTop: "1rem",

              justifyContent: "space-between",
            }}
          >
            <button type="submit" className="btn btn-primary text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default memo(SubCreateUserModal);
