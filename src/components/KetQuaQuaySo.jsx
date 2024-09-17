import React from "react";

const KetQuaQuaySo = ({ dsTrungGiai }) => {
  let dsTrungGiaiRender = dsTrungGiai;
  console.log(dsTrungGiaiRender);
  dsTrungGiaiRender.sort((a, b) => a.quanlity - b.quanlity);

  return (
    <div
      className="w-100 "
      style={{
        height: "42.25vh  ",
        overflowY: "auto",
        marginTop: "3vh",
      }}
    >
      <table
        className="w-100"
        style={{
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        <thead>
          <tr>
            <th scope="col">STT</th>
            <th scope="col">Người đại diện</th>
            <th scope="col">Công ty</th>
            <th scope="col">Số may mắn</th>
            <th scope="col">Đã trúng giải</th>
          </tr>
        </thead>

        <tbody>
          {dsTrungGiaiRender.map((l, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{l.nguoidaidien}</td>
              <td>{l.tencongty}</td>
              <td>{l.somayman}</td>
              <td>{l.tengiaithuong}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KetQuaQuaySo;

// DELETE ALL DATY IN COLLECTION
// for (let d of querySnapshot.docs) {
//   await deleteDoc(doc(db, "dstrunggiai", d.id));
// }
