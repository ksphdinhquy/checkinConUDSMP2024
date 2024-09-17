import React from "react";
import titlehoinghi from "./assets/titlehoinghi.png";

function App() {
  const navigateToPage = (page) => {
    window.location.href = page; // Navigate to the specified page
  };

  return (
    <div className="chaomung-wrapper" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#f0f0f0' // Optional: Set a background color
    }}>
      <img
        src={titlehoinghi} // Replace with your image URL
        alt="Hội nghị"
        className="main-image"
        style={{ maxWidth: '80%', height: 'auto', marginBottom: '20px', marginTop: '3vh' }}
      />
      <h1 className="main-title">Chào mừng bạn đến với Hội nghị!</h1>
      <h4 style={{ textAlign: 'center', marginTop: '3vh' }}>
        Bạn đã đăng ký chưa?
      </h4>
      <h4 style={{ textAlign: 'center', }}>
        Nếu đã đăng ký chọn "Điểm danh" và ngược lại, chọn "Đăng ký".
      </h4>
      <div className="button-container" style={{ display: 'flex', gap: '10px', marginTop: '3vh' }}>
        <button onClick={() => navigateToPage("/diem-danh")}>Điểm danh</button>
        <button onClick={() => navigateToPage("/dang-ky")}>Đăng Ký</button>
      </div>

      <style jsx>{`
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #1fb7b7;
          color: white;
          cursor: pointer;
          font-size: 1rem; /* Consistent font size */
        }

        button:hover {
          background-color: #0056b3; /* This color can be changed to fit the design */
        }
      `}</style>
    </div>
  );
}

export default App;