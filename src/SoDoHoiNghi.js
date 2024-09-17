import React, { useEffect, useState } from 'react';

const SoDoHoiNghi = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Giả định bạn sẽ lấy dữ liệu từ một API hoặc nguồn nào đó
        const fetchData = async () => {
            try {
                // Thay thế với API thực tế của bạn
                const response = await fetch('https://api.example.com/sodohoinhi');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Sơ Đồ Hội Nghị</h1>
            {data.length > 0 ? (
                <ul>
                    {data.map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Không có dữ liệu để hiển thị.</p>
            )}
        </div>
    );
};

export default SoDoHoiNghi;