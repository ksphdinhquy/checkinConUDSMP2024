import { Modal } from "antd";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";

const AddWorkshop = ({ modalIsOpen, setIsOpen }) => {
    const [listWorkShop, setListWorkShop] = useState({});
    const [workShop, setWorkShop] = useState({});

    const handleAddPrize = () => {
        setWorkShop((prev) => ({
            ...prev,
            [uuidv4()]: {
                name: "",
                isEnable: true,
            },
        }));
    };

    const handleDeleteWorkShop = (key) => {
        setWorkShop((prev) => {
            const newList = { ...prev };
            delete newList[key];
            return newList;
        });
    };

    const handleChange = (key, type, e) => {
        setWorkShop((prev) => {
            const newList = { ...prev };
            newList[key][type] = e.target.value;
            return newList;
        });
    };

    const handleEnable = (key) => {
        setWorkShop((prev) => {
            const newList = { ...prev };
            newList[key].isEnable = !newList[key].isEnable;
            return newList;
        });
    };

    const handleSubmit = async () => {
        const newListWorkShop = { ...listWorkShop };
        for (const key in newListWorkShop) {
            newListWorkShop[key].isEnable = false;
            if (newListWorkShop[key].name === "") {
                delete newListWorkShop[key];
            }
        }

        // Thay đổi tên document thành "room"
        await setDoc(doc(db, "room", "room"), newListWorkShop);
        toast.success("Lưu thành công!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "room", "room"), (doc) => {
            setListWorkShop(doc.data() || {});
        });
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
            footer={null}
        >
            <div>
                {Object.entries(listWorkShop).map(([key, value]) => (
                    <div className="d-flex mb-3" key={key}>
                        <input
                            className="form-control me-2"
                            placeholder="Tên hội thảo"
                            type="text"
                            disabled={!value.isEnable}
                            onChange={(e) => handleChange(key, "name", e)}
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
                            onClick={() => handleDeleteWorkShop(key)}
                        >
                            Xóa
                        </button>
                    </div>
                ))}
                <div className="d-flex align-items-center" style={{ marginTop: "2rem", justifyContent: "center" }}>
                    <button onClick={handleAddPrize} className="btn btn-secondary text-white">
                        Thêm Hội thảo
                    </button>
                </div>
                <div className="d-flex align-items-center" style={{ marginTop: "1rem", justifyContent: "flex-end" }}>
                    <button onClick={handleSubmit} className="btn btn-primary text-white">
                        Lưu lại
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default memo(AddWorkshop);