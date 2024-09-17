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
import nencheckinmobile from "./assets/nencheckinmobile.png";
import checkin from "./assets/checkin.png";
import titlechaomung from "./assets/titlecheckin.png";
import titlehoinghi from "./assets/titlehoinghi.png";

function Mobile() {
    const [userCurrent, setUserCurrent] = useState(null);
    const [loading, setLoading] = useState(false);
    const prev = useRef("");

    const scan = useCallback(async (value) => {
        if (value === prev.current) return;

        prev.current = value;

        setLoading(true);
        try {
            const q = query(collection(db, "users"), where("qrcode", "==", value));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (_doc) => {
                const date = moment().valueOf();
                const dateString = moment(date).format("DD-MM-YYYY").toString();
                setUserCurrent({ ..._doc.data(), checkIn: date });

                const q2 = query(
                    collection(db, "checkIns_test_5"),
                    where("qrcode", "==", _doc.data().qrcode)
                );

                let checkExist = (await getDocs(q2)).docs.some(snap =>
                    dateString === moment(snap.data().checkIn).format("DD-MM-YYYY").toString()
                );

                if (!checkExist) {
                    await setDoc(doc(db, "checkIns_test_5", uuidv4()), { ..._doc.data(), checkIn: date });
                }
            });
        } catch (error) {
            console.error("Error during scan:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    console.log(stream);
                })
                .catch(err => {
                    alert("Error accessing camera: " + err);
                });
        } else {
            alert("Sorry, browser does not support camera access");
        }
    }, []);

    return (
        <div className="main-wrapper position-relative" style={{ backgroundImage: `url(${nencheckinmobile})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                <div className="user-info text-center mb-4">
                    <img src={titlehoinghi} style={{ width: "90%" }} alt="hoinghi Title" />
                </div>
                <div className="scanner-container" style={{ width: "80%", maxWidth: "400px" }}>
                    <Scanner onScan={scan} />
                </div>
                <div className="user-info text-center mt-4">
                    <img src={titlechaomung} style={{ width: "80%" }} alt="Welcome Title" />
                    <h2 className="font-large text-blue" style={{ textTransform: "uppercase", margin: "1.15vh 0", fontSize: "3.5vw", lineHeight: 1.2 }}>
                        {userCurrent?.nguoidaidien || "."}
                    </h2>
                    <h2 className="font-large text-blue" style={{ textTransform: "uppercase", margin: "1.15vh 0", fontSize: "2.15vw", lineHeight: 1.2 }}>
                        {userCurrent?.chucvu} {userCurrent?.tencongty || "."}
                    </h2>

                </div>

                <img src={checkin} style={{ width: "90%" }} alt="checkin Title" />

                {loading && <div className="loading-indicator">Loading...</div>}
            </div>
        </div>
    );
}

export default Mobile;