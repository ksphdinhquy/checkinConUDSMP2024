import { Modal } from "antd";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";

const CoCauGiaiThuongModal = ({ modalIsOpen, setIsOpen }) => {
  const [listPrize, setListPrize] = useState({});

  const handleAddPrize = () => {
    setListPrize({
      ...listPrize,
      [uuidv4()]: {
        name: "",
        quanlity: "",
        isEnable: true,
      },
    });
  };

  const handleDeletePrize = (key) => {
    const newListPrize = { ...listPrize };
    delete newListPrize[key];
    setListPrize(newListPrize);
  };

  const handleChange = (key, type, e) => {
    const newListPrize = { ...listPrize };
    for (let [_key, _value] of Object.entries(newListPrize)) {
      if (_key === key) {
        _value[type] = e.target.value;
      }
    }
    setListPrize(newListPrize);
  };

  const handleEnable = (key) => {
    const newListPrize = { ...listPrize };
    newListPrize[key] = {
      ...newListPrize[key],
      isEnable: !newListPrize[key].isEnable,
    };
    setListPrize(newListPrize);
  };

  const handleSubmit = async () => {
    const newListPrize = { ...listPrize };
    for (let [key, value] of Object.entries(newListPrize)) {
      value["isEnable"] = false;
      if (value["name"] === "" || value["quanlity"] === "") {
        delete newListPrize[key];
      }
    }

    await setDoc(doc(db, "room", "cocaugiaithuong"), newListPrize);
    toast.success("Lưu thành công !", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "room", "room"),
      (doc) => {
        setListPrize(doc.data());
      }
    );
    return () => {
      unsub();
    };
  }, []);

  return (
    <Modal
      title="Danh sách Hội thảo"
      centered
      open={modalIsOpen}
      onCancel={() => setIsOpen(false)}
      footer={[]}
    >
      <div>
        {listPrize &&
          Object.entries(listPrize)
            .sort(
              ([_k1, v1], [_k2, v2]) =>
                Number(v1.quanlity) - Number(v2.quanlity)
            )
            .map(([key, value]) => {
              return (
                <div className="d-flex mb-3" key={key}>
                  <input
                    className="form-control me-2"
                    placeholder="Tên hội thảo"
                    type="text"
                    disabled={!value.isEnable}
                    onChange={(e) => handleChange(key, "name", e)}
                    name={`name-${key}`}
                    value={value.name}
                  />

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEnable(key)}
                  >
                    {value.isEnable ? "Thêm" : "Sửa"}
                  </button>
                  <button
                    className="btn btn-sm btn-danger text-white"
                    onClick={() => handleDeletePrize(key)}
                  >
                    Xóa
                  </button>
                </div>
              );
            })}
        <div
          className="d-flex align-items-center"
          style={{
            marginTop: "2rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleAddPrize}
            className="btn btn-secondary text-white"
          >
            Thêm Hội thảo
          </button>
        </div>
        <div
          className="d-flex align-items-center"
          style={{
            marginTop: "1rem",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={handleSubmit} className="btn btn-primary text-white">
            Lưu lại
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(CoCauGiaiThuongModal);
