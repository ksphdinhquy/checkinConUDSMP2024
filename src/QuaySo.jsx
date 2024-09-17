import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import ketquaquayso from "./assets/ketquaquayso.png";
import quayso from "./assets/quayso.png";
import KetQuaQuaySo from "./components/KetQuaQuaySo";
import QuaySoTab from "./components/QuaySoTab";
import { db } from "./firebase";
function QuaySo() {
  const [tab, setTab] = useState(1);

  const [dsTrungGiai, setDsTrungGiai] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "dstrunggiai"), orderBy("tengiaithuong"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      // for (let d of querySnapshot.docs) {
      //   await deleteDoc(doc(db, "dstrunggiai", d.id));
      // }
      setDsTrungGiai(
        querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={` main-wrapper-thong-ke main-wrapper-quay-so`}>
      <div
        className="h-100"
        style={{
          paddingLeft: "2vw",
          paddingRight: "2vw",
          paddingTop: "39vh",
        }}
      >
        <div
          className="text-center"
          style={{
            marginBottom: "7vh",
          }}
        >
          {/* <img
            src={titleImg}
            alt=""
            style={{
              maxWidth: "25vw",
            }}
          /> */}
        </div>
        <div className="d-flex">
          <div className="flex-1">
            <div className="title-wrapper mb-0">
              {" "}
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1vh",
                  marginBottom: "2vh",
                }}
                className="d-flex"
              >
                <div className="d-flex ms-2 ">
                  <img
                    style={{
                      height: "6vh  ",
                      marginRight: "1vw",
                      cursor: "pointer",
                    }}
                    onClick={() => setTab(1)}
                    src={quayso}
                    alt=""
                  />

                  <img
                    onClick={() => setTab(2)}
                    style={{
                      height: "6vh  ",
                      marginLeft: "1vw",
                      cursor: "pointer",
                    }}
                    src={ketquaquayso}
                    alt=""
                  />

                  {/* <button
                    size="large"
                    onClick={() => setTab(1)}
                    type={tab === 1 ? "primary" : "dashed"}
                    className="me-2 primary-button-main"
                  >
                    Quay số
                  </button>
                  <button
                    size="large"
                    className="primary-button-main"
                    onClick={() => setTab(2)}
                    type={tab === 2 ? "primary" : "dashed"}
                  >
                    Kết quả quay số
                  </button> */}
                </div>
              </div>
            </div>

            {tab === 1 && <QuaySoTab dsTrungGiai={dsTrungGiai} />}
            {tab === 2 && <KetQuaQuaySo dsTrungGiai={dsTrungGiai} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuaySo;
