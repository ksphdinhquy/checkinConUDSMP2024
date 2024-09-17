import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import ChaoMungComponent from "./components/ChaoMungComponent";
import { db } from "./firebase";

function ChaoMung() {
  const [userCurrent, setUserCurrent] = useState(null);
  const [listAttend, setListAttend] = useState([]);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "diemdanh"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const attendees = querySnapshot.docs.map((d) => d.data());
      setListAttend(attendees);
      setLoading(false); // Set loading to false after fetching
    }, (error) => {
      console.error("Error fetching data: ", error);
      setLoading(false); // Handle error and stop loading
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading || listAttend.length === 0) return; // Skip if loading or no attendees

    const interval = setInterval(() => {
      if (count > 5) {
        // Update the index and userCurrent
        setIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % listAttend.length;
          setUserCurrent(listAttend[nextIndex]);
          return nextIndex;
        });
        setCount(1); // Reset count
      } else {
        setCount((c) => c + 1);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [count, loading, listAttend]);

  return (
    <div className="chaomung-wrapper position-relative">
      <div className="h-100 d-flex align-items-center">
        <div className="w-100 d-flex justify-content-center align-items-center" >
          <div className="d-flex align-items-center" style={{ width: "100%", justifyContent: "center", borderRadius: "1rem", overflow: "hidden", }}>
            {loading ? (
              <div>Loading...</div> // Loading state
            ) : (
              <ChaoMungComponent userCurrent={userCurrent} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChaoMung;