import { Modal } from "antd";
import { doc, setDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";

const initState = {
  qrcode: "",
  nguoidaidien: "",
  soban: "",
  somayman: "",
  tencongty: "",
};

const SubUpdateUserModal = ({ modalIsOpen, setIsOpen, initForm }) => {
  const [form, setForm] = useState(initState);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    for (let [key, val] of Object.entries(form)) {
      if (!val || val === "") {
        delete form[key];
      }
    }
    const usersRef = doc(db, "users", form?.id);

    setDoc(usersRef, form, {
      merge: true,
    });
    toast.success("Cập nhật thành công !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setIsOpen(false);
    setForm(initState);
  };

  useEffect(() => {
    if (initForm) {
      setForm(initForm);
    }
  }, [initForm]);

  return (
    <Modal
      title="Sửa khách hàng"
      centered
      open={modalIsOpen}
      onCancel={() => {
        setForm(initState);

        setIsOpen(false);
      }}
      footer={[]}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <p className="mb-0 mt-2">Người đại diện </p>
          <input
            className="form-control"
            type="text"
            placeholder="Người đại diện"
            onChange={handleChange}
            name="nguoidaidien"
            value={form?.nguoidaidien}
          />
          <p className="mb-0 mt-2">Số bàn </p>
          <input
            className="form-control"
            type="text"
            required
            onChange={handleChange}
            name="soban"
            value={form?.soban}
          />

          <p className="mb-0 mt-2">Số may mắn </p>
          <input
            className="form-control"
            type="text"
            name="somayman"
            value={form?.somayman}
            onChange={handleChange}
          />

          <p className="mb-0 mt-2">Tên công ty</p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            name="tencongty"
            required
            value={form?.tencongty}
          />

          <p className="mb-0 mt-2">QR code </p>
          <input
            className="form-control"
            type="text"
            onChange={handleChange}
            required
            name="qrcode"
            value={form?.qrcode}
          />

          <div
            className="d-flex align-items-center"
            style={{
              marginTop: "1rem",

              justifyContent: "flex-end",
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

export default memo(SubUpdateUserModal);
