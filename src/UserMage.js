import { Spin } from "antd";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  getDocs, // Thêm dòng này
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminWrappter from "./components/AdminWrappter";
import CreateUserModal from "./components/AddUser";
import UpdateUserModal from "./components/UpdateUserModal";
import { db } from "./firebase";
import useDebounce from "./hooks/useDebounce";
import titlehoinghi from "./assets/titlehoinghi.png";
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const UserMage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchSoDienThoai, setSearchSoDienThoai] = useState("");
  const [selectUser, setSelectedUser] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [tabs, setTabs] = useState([]);
  const debouncedValue = useDebounce(search, 600);
  const debouncedSoDienThoai = useDebounce(searchSoDienThoai, 600);
  const [unit, setUnit] = useState("All");
  const [loading, setLoading] = useState(true);

  const handleModalUpdate = (val) => {
    if (!val) {
      setSelectedUser(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đại biểu này?")) {
      try {
        const usersRef = doc(db, "daibieu", id);
        await deleteDoc(usersRef);
        toast.success("Đại biểu đã được xóa thành công.");
      } catch (error) {
        toast.error("Xóa đại biểu không thành công. Vui lòng thử lại.");
      }
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        for (const item of jsonData) {
          const { hovaten, donvi, sodienthoai, email, room } = item;

          // Kiểm tra xem các trường cần thiết có tồn tại
          if (hovaten && donvi && sodienthoai && room) {
            const newUserId = doc(collection(db, "daibieu")).id;
            await setDoc(doc(db, "daibieu", newUserId), {
              hovaten,
              donvi,
              sodienthoai,
              email,
              room, // Đảm bảo room được lưu
            });
          } else {
            toast.warning("Dữ liệu không đầy đủ, bỏ qua bản ghi.");
          }
        }
        toast.success("Import dữ liệu thành công!");
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi import dữ liệu.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = async () => {
    try {
      const q = query(collection(db, "diemdanh"), orderBy("checkIn"));
      const querySnapshot = await getDocs(q);

      const exportData = querySnapshot.docs.map(doc => {
        const data = { ...doc.data(), id: doc.id };

        // Kiểm tra và định dạng trường checkIn
        if (data.checkIn && data.checkIn instanceof Timestamp) {
          const unixTimestamp = data.checkIn.toMillis(); // Chuyển đổi sang Unix Timestamp
          data.checkIn = format(new Date(unixTimestamp), 'HH:mm dd/MM/yyyy'); // Định dạng
        }

        return data;
      });

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "DiemDanh");

      const fileName = `danhsach_diemdanh_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success("Dữ liệu đã được xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất dữ liệu:", error);
      toast.error("Đã xảy ra lỗi khi xuất dữ liệu.");
    }
  };

  const handleDownloadTemplate = () => {
    const data = [
      { hovaten: 'Nguyễn Văn A', donvi: 'Công ty A', sodienthoai: '0123456789', email: 'exampleA@mail.com', room: 'Phong 1' },
      { hovaten: 'Trần Thị B', donvi: 'Công ty B', sodienthoai: '0987654321', email: 'exampleB@mail.com', room: 'Phong 2' },
      { hovaten: 'Lê Văn C', donvi: 'Công ty C', sodienthoai: '1234567890', email: 'exampleC@mail.com', room: 'Phong 3' },
    ];

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mẫu Dữ Liệu');

    // Ghi file
    XLSX.writeFile(wb, 'mau_du_lieu_import.xlsx');
  };

  useEffect(() => {
    const q = query(collection(db, "daibieu"), orderBy("hovaten"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });

      const roomUnit = Array.from(new Set(arr.map((e) => e.room)));
      roomUnit.sort((a, b) => Number(a) - Number(b));
      setTabs(roomUnit);

      setLoading(false);

      setUsers(
        arr.filter(
          (u) =>
            (unit === "All" || u.room === unit) &&
            (u.hovaten?.toUpperCase().includes(debouncedValue.toUpperCase())) &&
            (u.sodienthoai?.toUpperCase().includes(debouncedSoDienThoai.toUpperCase()))
        )
      );
    });
    return () => {
      unsubscribe();
    };
  }, [debouncedValue, debouncedSoDienThoai, unit]);

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
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <ToastContainer />
      <AdminWrappter>
        <div style={{ textAlign: "center" }}>
          <div className="user-info text-center mb-4">
            <img src={titlehoinghi} style={{ width: "90%", marginTop: "1rem" }} alt="hoinghi Title" />
          </div>
          <button
            className="btn text-white btn-danger text-bold"
            onClick={() => setShowModalCreate(true)}
          >
            Thêm đại biểu
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImport}
            className="btn btn-success text-bold ms-2"
          />
          <button className="btn btn-info text-bold ms-2" onClick={handleDownloadTemplate}>
            Tải File Mẫu
          </button>
          <button
            className="btn text-white btn-warning text-bold ms-2"
            onClick={handleExport}
          >
            Xuất dữ liệu
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <div className="d-flex align-items-center justify-content-center" style={{ marginBottom: "1vh" }}>
            <input
              className="form-control form-control-sm"
              placeholder="Tìm kiếm đại biểu (có dấu)"
              type="text"
              style={{ maxWidth: "75%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center" style={{ marginBottom: "1vh" }}>
            <input
              className="form-control form-control-sm"
              placeholder="Tìm kiếm theo số điện thoại"
              type="text"
              style={{ maxWidth: "75%" }}
              value={searchSoDienThoai}
              onChange={(e) => setSearchSoDienThoai(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-center" style={{ marginBottom: "3vh" }}>
            <select
              className="form-select form-select-sm"
              value={unit}
              style={{ maxWidth: "75%" }}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="All">Chọn Hội thảo</option>
              {tabs.map((t) => (
                <option value={t} key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={{ marginRight: '1rem', marginLeft: '1rem', maxHeight: "80vh", overflowY: "auto" }}>
            <table className="w-100">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Người đại diện</th>
                  <th scope="col">Đơn vị</th>
                  <th scope="col">Số điện thoại</th>
                  <th scope="col">Email</th>
                  <th scope="col">Đăng ký</th>
                  <th scope="col" colSpan={2}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">Không tìm thấy đại biểu nào.</td>
                  </tr>
                ) : (
                  users.map((l, i) => (
                    <tr key={l.id}>
                      <td>{i + 1}</td>
                      <td>{l.hovaten}</td>
                      <td>{l.donvi}</td>
                      <td>{l.sodienthoai}</td>
                      <td>{l.email}</td>
                      <td>{l.room}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="btn btn-danger me-2 text-white"
                        >
                          Xóa
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setSelectedUser(l)}
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminWrappter>

      <CreateUserModal
        modalIsOpen={showModalCreate}
        setIsOpen={setShowModalCreate}
      />

      <UpdateUserModal
        modalIsOpen={Boolean(selectUser)}
        setIsOpen={handleModalUpdate}
        initForm={selectUser}
      />
    </>
  );
};

export default UserMage;