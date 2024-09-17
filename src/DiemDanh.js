import { Spin } from "antd";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    where,
    getDocs,
    doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminWrappter from "./components/AdminWrappter";
import UpdateUserModal from "./components/UpdateUserModal";
import { db } from "./firebase";
import useDebounce from "./hooks/useDebounce";
import titlehoinghi from "./assets/titlehoinghi.png";
import titledadangky from "./assets/titledadangky.png";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';

const DiemDanh = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchSoDienThoai, setSearchSoDienThoai] = useState("");
    const [selectUser, setSelectedUser] = useState(null);
    const [tabs, setTabs] = useState([]);
    const debouncedValue = useDebounce(search, 600);
    const debouncedSoDienThoai = useDebounce(searchSoDienThoai, 600);
    const [unit, setUnit] = useState("All");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleModalUpdate = (val) => {
        if (!val) {
            setSelectedUser(null);
        }
    };

    useEffect(() => {
        const q = query(collection(db, "daibieu"), orderBy("hovaten"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const arr = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

            const roomUnit = Array.from(new Set(arr.map((e) => e.room)));
            roomUnit.sort((a, b) => Number(a) - Number(b));
            setTabs(roomUnit);
            setLoading(false);

            const filteredUsers = arr.filter((u) =>
                (unit === "All" ? true : u.room === unit) &&
                u.hovaten.toUpperCase().includes(debouncedValue.toUpperCase()) &&
                u.sodienthoai.toUpperCase().includes(debouncedSoDienThoai.toUpperCase())
            );

            setUsers(debouncedValue || debouncedSoDienThoai ? filteredUsers : []);
        }, (error) => {
            console.error("Error fetching users: ", error);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [debouncedValue, debouncedSoDienThoai, unit]);

    const handleConfirm = async (user) => {
        const date = moment();
        const dateString = date.format("HH:mm DD-MM-YYYY");

        const checkInQuery = query(
            collection(db, "diemdanh")
        );

        const existingCheckIns = await getDocs(checkInQuery);
        const checkExists = existingCheckIns.docs.some(snap =>
            dateString === moment(snap.data().checkIn).format("HH:mm DD-MM-YYYY")
        );

        if (!checkExists) {
            await setDoc(doc(db, "diemdanh", uuidv4()), {
                ...user,
                checkIn: date.valueOf(), // Lưu thời gian dưới dạng timestamp
            });
            alert(`Điểm danh thành công cho ${user.hovaten}`);

            // Chờ 3 giây trước khi chuyển hướng
            setTimeout(() => {
                navigate('/so-do-hoi-nghi');
            }, 3000);
        } else {
            alert(`Bạn đã điểm danh vào ngày ${dateString}`);
        }
    };

    return (
        <>
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,.3)",
                    }}
                >
                    <Spin size="large" />
                </div>
            )}
            <ToastContainer />
            <AdminWrappter>
                <div className="text-center">
                    <img
                        src={titlehoinghi}
                        style={{
                            width: "90%",
                            marginTop: "1vh",
                            marginBottom: "1vh"
                        }}
                        alt="Title Hôi Nghị"
                    />
                    <img
                        src={titledadangky}
                        style={{
                            width: "80%",
                            marginTop: "1vh",
                            marginBottom: "1vh"
                        }}
                        alt="Title Đăng Ký"
                    />
                    <div className="d-flex align-items-center justify-content-center" style={{ margin: "1vh auto" }}>
                        <input
                            className="form-control form-control-sm"
                            placeholder="Nhập họ và tên để điểm danh"
                            type="text"
                            style={{ maxWidth: "75%" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center justify-content-center" style={{ margin: "1vh auto" }}>
                        <input
                            className="form-control form-control-sm"
                            placeholder="Hoặc nhập số điện thoại"
                            type="text"
                            style={{ maxWidth: "75%" }}
                            value={searchSoDienThoai}
                            onChange={(e) => setSearchSoDienThoai(e.target.value)}
                        />
                    </div>

                    <div style={{ maxWidth: "95%", maxHeight: "42.25vh", overflowY: "auto", margin: "0 auto", textAlign: "center" }}>
                        {users.length > 0 ? (
                            <table className="w-100" style={{ margin: "0 auto", }}>
                                <thead>
                                    <tr style={{ fontSize: "1rem" }}>
                                        <th style={{ fontSize: "1rem" }} scope="col">STT</th>
                                        <th style={{ fontSize: "1rem" }} scope="col">HỌ VÀ TÊN</th>
                                        <th style={{ fontSize: "1rem" }} scope="col">ĐƠN VỊ</th>
                                        <th style={{ fontSize: "1rem" }} scope="col">SỐ ĐIỆN THOẠI</th>
                                        <th style={{ fontSize: "1rem" }} scope="col">ĐĂNG KÝ</th>
                                        <th style={{ fontSize: "1rem" }} scope="col" colSpan="2">HÀNH ĐỘNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((l, i) => (
                                        <tr key={l.id} style={{ fontSize: "2rem" }}>
                                            <td style={{ fontSize: "1rem" }}>{i + 1}</td>
                                            <td style={{ fontSize: "1rem" }}>{l.hovaten}</td>
                                            <td style={{ fontSize: "1rem" }}>{l.donvi}</td>
                                            <td style={{ fontSize: "1rem" }}>{l.sodienthoai}</td>
                                            <td style={{ fontSize: "1rem" }}>{l.room}</td>
                                            <td>
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => setSelectedUser(l)}
                                                >
                                                    Cập nhật
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => handleConfirm(l)}
                                                >
                                                    Điểm danh
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Không có dữ liệu để điểm danh.</p>
                        )}
                    </div>
                </div>
            </AdminWrappter>
            <UpdateUserModal
                modalIsOpen={Boolean(selectUser)}
                setIsOpen={handleModalUpdate}
                initForm={selectUser}
            />
        </>
    );
};

export default DiemDanh;