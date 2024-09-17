import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { doc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import titlehoinghi from "./assets/titlehoinghi.png";

const initState = {
    qrcode: "",
    hovaten: "",
    donvi: "",
    sodienthoai: "",
    email: "",
    room: "",
};

const DangKy = () => {
    const [form, setForm] = useState(initState);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const roomsCollection = collection(db, "room");
                const roomsQuery = query(roomsCollection, orderBy("name"));
                const roomSnapshot = await getDocs(roomsQuery);
                const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRooms(roomList);
            } catch (error) {
                toast.error("Không thể tải danh sách phòng!", {
                    position: "top-right",
                    autoClose: 3000,
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

        // Kiểm tra dữ liệu trước khi gửi
        if (!form.hovaten || form.hovaten.trim() === "") {
            toast.error("Họ và tên không được để trống!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Lọc dữ liệu không hợp lệ
        for (let [key, val] of Object.entries(form)) {
            if (!val || val.trim() === "") {
                delete form[key];
            }
        }

        try {
            await setDoc(usersRef, form);
            setForm(initState);
            toast.success("Đã đăng ký tham dự Hội thảo thành công!", {
                position: "top-right",
                autoClose: 3000,
            });

            // Chờ 3 giây trước khi chuyển hướng
            setTimeout(() => {
                navigate('/diem-danh');
            }, 3000);
        } catch (error) {
            console.error("Error registering:", error);
            toast.error("Có lỗi xảy ra. Vui lòng thử lại!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (

        <div className="chaomung-wrapper position-relative" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="user-info text-center mb-4">
                <img src={titlehoinghi} style={{ width: "90%", marginTop: "1rem" }} alt="hoinghi Title" />
            </div>
            <h1>ĐĂNG KÝ THAM DỰ</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
                <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Họ và tên"
                        onChange={handleChange}
                        name="hovaten"
                        value={form.hovaten}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Đơn vị</label>
                    <input
                        className="form-control"
                        type="text"
                        required
                        onChange={handleChange}
                        name="donvi"
                        placeholder="Đơn vị công tác hay học tập"
                        value={form.donvi}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        className="form-control"
                        type="text"
                        required
                        onChange={handleChange}
                        name="sodienthoai"
                        placeholder="Số điện thoại"
                        value={form.sodienthoai}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control"
                        type="email"
                        required
                        onChange={handleChange}
                        name="email"
                        placeholder="Email"
                        value={form.email}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Đăng ký</label>
                    <select
                        className="form-control"
                        name="room"
                        value={form.room}
                        onChange={handleChange}
                    >
                        <option value="">Chọn Hội thảo</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.name}>
                                {room.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-warning">Đăng ký</button>
                </div>
            </form>
            <ToastContainer
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999
                }}
            />
        </div>
    );
};

export default DangKy;