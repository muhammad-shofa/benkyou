/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Modal from "./Modal";

function HeaderDasboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex gap-5 justify-center items-center max-w-[1200px] h-[250px] w-full bg-gray-100 rounded-md p-4 text-sm">
      <button
        onClick={openModal}
        className="flex justify-center items-center text-md bg-[#7752FE] max-w-[180px] h-[50px] rounded-sm px-3 text-white font-bold"
      >
        Create New Class
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <button className="flex justify-center items-center text-md bg-[#361f8e] max-w-[250px] h-[50px] rounded-sm px-3 text-white font-bold">
        Create New Material
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      <Modal isVisible={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default HeaderDasboard;
