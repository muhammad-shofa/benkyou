/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

function Card({ children }) {
  return (
    <div className="card min-w-[250px] max-w-[400px] bg-gray-200 rounded-md py-3 px-4">
      {children /* Isi konten Card */}
    </div>
  );
}

// dapat dikostum sesuai keinginan pada saat memanggilnya
export default Card;
