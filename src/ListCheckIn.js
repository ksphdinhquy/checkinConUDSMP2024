import { Button } from "antd";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import titlehoinghi from "./assets/titlehoinghi.png";

function ListCheckIn() {
  const [listAttend, setListAttend] = useState([]);
  const [total, setTotal] = useState({ totalJoin: 0, total: 0, totalNotJoin: 0 });
  const [listCountUnit, setListCountUnit] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [unit, setUnit] = useState("All");
  const [isJoin, setIsJoin] = useState(true); // true: Đã điểm danh, false: Chưa điểm danh

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "diemdanh"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const checkInData = querySnapshot.docs.map((d) => d.data());
          const querySnapshot_2 = await getDocs(collection(db, "daibieu"));
          const allParticipants = querySnapshot_2.docs.map((doc) => doc.data());
          const roomUnit = Array.from(new Set(allParticipants.map((e) => e.room)));

          roomUnit.sort((a, b) => Number(a) - Number(b));
          setTabs(roomUnit);

          // Lọc người tham gia
          const filteredUsers = isJoin
            ? checkInData.filter((n) => unit === "All" || n.room === unit)
            : allParticipants.filter((n) =>
              !checkInData.some((r) => r.sodienthoai === n.sodienthoai) && (unit === "All" || n.room === unit)
            );

          setListAttend(filteredUsers);

          const totalJoin = checkInData.length;
          const totalNotJoin = allParticipants.length - totalJoin;

          const newListCountUnit = roomUnit.map((key) => ({
            key,
            value: {
              data: checkInData.filter((u) => u.room === key).length,
              totalItemsUnit: allParticipants.filter((c) => c.room === key).length,
            },
          }));

          setListCountUnit(newListCountUnit);
          setTotal({ totalJoin, total: allParticipants.length, totalNotJoin });
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [isJoin, unit]);

  return (
    <div className="main-wrapper-thong-ke" style={{
      width: "100%",
      height: "100vh",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      fontFamily: `"Montserrat", sans-serif`
    }}>
      <div className="h-100" style={{ padding: "1vh 1vw" }}>
        <div className="text-center mb-4">
          <img src={titlehoinghi} style={{ width: "90%" }} alt="Hội nghị Title" />
          <h2 style={{ marginTop: '1rem' }}>THỐNG KÊ TÌNH HÌNH ĐIỂM DANH THAM GIA HỘI NGHỊ</h2>
        </div>
        <div className="d-flex">
          <div className="flex-1" style={{ paddingRight: "20px" }}>
            <div className="title-wrapper" style={{ marginBottom: 0 }}>
              <div className="d-flex align-items-center">
                <select
                  className="form-select form-select-sm w-100"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="All">Tất cả</option>
                  {tabs.map((t) => (
                    <option value={t} key={t}>{t}</option>
                  ))}
                </select>
                <div className="d-flex ms-2">
                  <Button
                    onClick={() => setIsJoin(true)}
                    type={isJoin ? "primary" : "dashed"}
                    className="me-2"
                  >
                    Đã tham gia
                  </Button>
                  <Button
                    onClick={() => setIsJoin(false)}
                    type={!isJoin ? "primary" : "dashed"}
                  >
                    Chưa tham gia
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-100" style={{ maxHeight: "50.25vh", overflowY: "auto", marginTop: "3vh" }}>
              <table className="w-100" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">HỌ VÀ TÊN</th>
                    <th scope="col">ĐƠN VỊ</th>
                    <th scope="col">SỐ ĐIỆN THOẠI</th>
                    <th scope="col">EMAIL</th>
                    <th scope="col">ĐIỂM DANH</th>
                  </tr>
                </thead>
                <tbody>
                  {listAttend.map((l, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{l.hovaten}</td>
                      <td>{l.donvi}</td>
                      <td>{l.sodienthoai}</td>
                      <td>{l.email}</td>
                      <td>
                        {isJoin
                          ? moment(l.checkIn).format("HH:mm DD-MM-YYYY")
                          : "Chưa Điểm danh"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="statistical">
            <div className="d-flex h-100" style={{ paddingLeft: 20, fontSize: 18 }}>
              <div>
                <p style={{ marginBottom: 5, background: "red", color: "white", padding: "7px 12px" }}>
                  Số lượng đại biểu đã tham gia:
                  <b className="ms-1">{total.totalJoin} / {total.total}</b>
                </p>
                <p style={{ marginBottom: 5, background: "blue", color: "white", padding: "7px 12px" }}>
                  Số lượng đại biểu chưa tham gia:
                  <b className="ms-1">{total.totalNotJoin} / {total.total}</b>
                </p>
                <div className="listCountUnit">
                  {listCountUnit.map((l, i) => (
                    <p key={i} style={{ background: "#e8eeef", marginBottom: 3, padding: "10px 12px", textAlign: "center" }}>
                      {l.key} :{" "}
                      <b className="ms-1">{l.value.data} / {l.value.totalItemsUnit}</b>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListCheckIn;