import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Scanner from "./components/scanner";
import { db } from "./firebase";

import chaomung from "./assets/checkin.png";
import titlechaomung from "./assets/titlecheckin.png";

// import soban from "./assets/soban.png";

function Checkin() {
    const [userCurrent, setUserCurrent] = useState(null);

    const prev = useRef("");

    const scan = useCallback(async (value) => {
        console.log(value === prev.current);
        if (value === prev.current) {
            try {
                // getDoc(doc(db, "checkIns_test_5", prev.current)).then((data) => {
                //   if (data.exists()) {
                //     Swal.fire({
                //       icon: "success",
                //       title: `Bạn đã checkIn vào lúc ${moment(data.data().checkIn)
                //         .format("DD-MM-YYYY HH:MM:SS")
                //         .toString()}`,
                //       timer: 5000,
                //     });
                //   }
                // });
            } catch (error) { }

            return;
        } else {
            prev.current = value;
        }

        const q = query(
            collection(db, "users"),
            where("qrcode", "==", value || "")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (_doc) => {
            const date = moment().valueOf();
            const dateString = moment(date).format("DD-MM-YYYY").toString();
            setUserCurrent({ ..._doc.data(), checkIn: date });
            const q2 = query(
                collection(db, "checkIns_test_5"),
                where("qrcode", "==", _doc.data().qrcode)
            );
            let checkExist = false;
            // let snapCheckTime;
            for (let snap of (await getDocs(q2)).docs) {
                if (
                    dateString ===
                    moment(snap.data().checkIn).format("DD-MM-YYYY").toString()
                ) {
                    checkExist = true;
                    // snapCheckTime = moment(snap.data().checkIn)
                    //   .format("DD-MM-YYYY HH:MM:SS")
                    //   .toString();
                }
            }
            if (!checkExist) {
                await setDoc(doc(db, "checkIns_test_5", uuidv4()), {
                    ..._doc.data(),
                    checkIn: date,
                });
            } else {
                // Swal.fire({
                //   icon: "success",
                //   title: `Bạn đã checkIn vào lúc ${snapCheckTime}`,
                //   timer: 5000,
                // });
            }
        });
    }, []);

    useEffect(() => { }, []);

    useEffect(() => {
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                {
                    video: true,
                },
                function (localMediaStream) {
                    console.log(localMediaStream);
                },
                function (err) {
                    alert(
                        "The following error occurred when trying to access the camera: " +
                        err
                    );
                }
            );
        } else {
            alert("Sorry, browser does not support camera access");
        }
    }, []);

    return (
        <div className={` main-wrapper position-relative`}>
            <div className="h-100 d-flex flex-column">
                <div
                    className="w-100  d-flex justify-content-center align-items-center"
                    style={{
                        marginBottom: "5.5vh",
                        marginTop: "28vh",
                    }}
                >
                    <div
                        className="d-flex flex-column"
                        style={{
                            width: "40%",
                        }}
                    >
                        <Scanner onScan={scan} />
                    </div>
                    <div
                        className="d-flex align-items-center"
                        style={{
                            width: "40%",
                            maxHeight: "72vh",
                            padding: "1vh 1vw",
                            overflow: "auto",
                            marginLeft: "5.5vw",
                        }}
                    >
                        <div className="d-flex flex-column align-items-center">
                            <div
                                style={{
                                    maxWidth: "100%",
                                }}
                            >
                                <img
                                    src={titlechaomung}
                                    style={{
                                        width: "100%",
                                    }}
                                    alt=""
                                />
                            </div>
                            <h2
                                className="font-large text-center  text-blue"
                                style={{
                                    textTransform: "uppercase",
                                    marginBottom: "1.15vh",
                                    fontSize: "3.5vw",
                                    lineHeight: 1.2,
                                }}
                            >
                                {userCurrent?.nguoidaidien || "."}
                            </h2>
                            <h2
                                className="font-large text-center  text-blue"
                                style={{
                                    textTransform: "uppercase",
                                    marginBottom: "1.15vh",
                                    fontSize: "2.15vw",
                                    lineHeight: 1.2,
                                }}
                            >
                                {userCurrent?.chucvu} {userCurrent?.tencongty || "."}
                            </h2>
                            <div
                                style={{
                                    maxWidth: "100%",
                                    marginTop: "1vh",
                                }}
                            >
                                <img
                                    src={chaomung}
                                    style={{
                                        width: "100%",
                                    }}
                                    alt=""
                                />
                            </div>

                            {/* <div
                  className=""
                  style={{
                    marginTop: "2vh",
                  }}
                >
                  <div
                    className="m-auto  "
                    style={{
                      maxWidth: "75%",
                      position: "relative",
                    }}
                  >
                    <img className="w-100" src={soban} alt="" />
                    <h1
                      style={{
                        position: "absolute",
                        right: "3vw",
                        bottom: 0,
                        top: "40%",
                        transform: "translateY(-50%)",
                        marginBottom: 0,
                        fontWeight: 900,
                        fontSize: "3vw",
                        lineHeight: 1,
                      }}
                    >
                      {userCurrent?.soban || "."}
                    </h1>
                  </div>
                </div> */}
                        </div>
                        {/* <div>
                <h2
                  className="font-large text-center border-text-white text-orange"
                  style={{
                    textTransform: "uppercase",
                    marginBottom: "1.15vh",
                    lineHeight: 1.35,
                  }}
                >
                  NHIỆT LIỆT CHÀO MỪNG
                </h2>
                <h2
                  className="font-large text-center  text-blue"
                  style={{
                    textTransform: "uppercase",
                    marginBottom: "1.15vh",
                    lineHeight: 1.35,
                  }}
                >
                  {userCurrent?.nguoidaidien || "- - - - - - - -"}
                </h2>
                <h2
                  className="font-large text-center  text-blue"
                  style={{
                    textTransform: "uppercase",
                    marginBottom: "1.15vh",
                    lineHeight: 1.35,
                  }}
                >
                  {userCurrent?.tencongty || "- - - - - - - -"}
                </h2>
                <h2
                  className="font-large text-center border-text-white text-orange"
                  style={{
                    textTransform: "uppercase",
                    marginBottom: "1.15vh",
                    lineHeight: 1.35,
                  }}
                >
                  ĐÃ VỀ THAM DỰ HỘI NGHỊ
                </h2>
                <h2
                  className="font-large text-center  text-blue"
                  style={{
                    textTransform: "uppercase",
                    marginBottom: "1.15vh",
                    lineHeight: 1.35,
                  }}
                >
                  SỐ BÀN : {userCurrent?.soban || "- - - - - - - -"}
                </h2>
              </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkin;
