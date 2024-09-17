import { Modal } from "antd";
import { doc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import React, { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";

const initState = {
    qrcode: "",
    hovaten: "",
    donvi: "",
    sodienthoai: "",
    email: "",
    room: "",
};

const AddUser = ({ modalIsOpen, setIsOpen }) => {
    const [form, setForm] = useState(initState);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsCollection = collection(db, "room");
                const roomsQuery = query(roomsCollection, orderBy("name")); // Sắp xếp theo trường "name"
                const roomSnapshot = await getDocs(roomsQuery);
                const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRooms(roomList);
            } catch (error) {
                toast.error("Không thể tải danh sách phòng!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };

        fetchRooms();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usersRef = doc(db, "daibieu", uuidv4());

        if (!form.hovaten || form.hovaten === "") {
            form.hovaten = "Họ và tên Đại biểu";
        }

        for (let [key, val] of Object.entries(form)) {
            if (!val || val === "") {
                delete form[key];
            }
        }

        try {
            await setDoc(usersRef, form);
            setForm(initState);
            toast.success("Thêm mới thành công!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <Modal
            title="Thêm mới đại biểu"
            centered
            open={modalIsOpen}
            onCancel={() => setIsOpen(false)}
            footer={[]}
        >
            <div>
                <form onSubmit={handleSubmit}>
                    <p className="mb-0 mt-2">Họ và tên</p>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Họ và tên"
                        onChange={handleChange}
                        name="hovaten"
                        value={form.hovaten}
                    />
                    <p className="mb-0 mt-2">Đơn vị</p>
                    <input
                        className="form-control"
                        type="text"
                        required
                        onChange={handleChange}
                        name="donvi"
                        placeholder="Đơn vị công tác hay học tập"
                        value={form.donvi}
                    />
                    <p className="mb-0 mt-2">Số điện thoại</p>
                    <input
                        className="form-control"
                        type="text"
                        required
                        onChange={handleChange}
                        name="sodienthoai"
                        placeholder="Số điện thoại"
                        value={form.sodienthoai}
                    />
                    <p className="mb-0 mt-2">Email</p>
                    <input
                        className="form-control"
                        type="text"
                        required
                        onChange={handleChange}
                        name="email"
                        placeholder="Email"
                        value={form.email}
                    />
                    <p className="mb-0 mt-2">Đăng ký</p>
                    <select
                        className="form-control"
                        name="room"
                        value={form.room}
                        onChange={handleChange}
                    >
                        <option value="">Chọn Hội thảo</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.name}>
                                {room.name} {/* Giả sử trường name có trong tài liệu room */}
                            </option>
                        ))}
                    </select>

                    <div
                        className="d-flex align-items-center"
                        style={{
                            marginTop: "1rem",
                            justifyContent: "flex-end",
                        }}
                    >
                        <button type="submit" className="btn btn-primary text-white">
                            Thêm mới
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default memo(AddUser);