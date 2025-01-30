/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Modal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-sm">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a new class</h2>
        {/* form input */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="className"
              className="block text-gray-700 font-medium mb-2"
            >
              Class Name
            </label>
            <input
              type="text"
              id="className"
              name="className"
              placeholder="Enter class name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="all-button-create-class flex justify-end gap-3">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
