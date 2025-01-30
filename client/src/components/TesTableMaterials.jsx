/* eslint-disable no-unused-vars */
// src/components/Table.js
import React, { useEffect, useState } from "react";

const TableMaterials = () => {
  const [data, setData] = useState([]);
  const [contentType, setContentType] = useState("text");
  const [isShowContentOpen, setIsShowContentOpen] = useState(false);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [file, setFile] = useState(null);
  const teacher_id = localStorage.getItem("id");
  const [newMaterials, setNewMaterials] = useState({
    teacher_id: teacher_id,
    title: "",
    content_type: contentType,
    content_text: "",
    name_pdf: "",
    data_pdf: "",
    mimetype_pdf: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/materials");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // TES DARI CHAT START
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMaterials((prevState) => ({
        ...prevState,
        name_pdf: file.name,
        data_pdf: file,
        mimetype_pdf: file.type,
      }));
    }
  };
  // TES DARI CHAT END

  // function untuk menangani ketika select option pada Type Content diubah
  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  const handleShowContentClick = (material) => {
    setSelectedMaterial(material);
    setIsShowContentOpen(true);
  };

  const handleEditClick = (material) => {
    setSelectedMaterial(material);
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (material) => {
    setSelectedMaterial(material);
    setIsDeletePopupOpen(true);
  };

  const handleAddClick = () => {
    setIsAddPopupOpen(true);
  };

  // ketika ada file yang diupload
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedMaterial(null);
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedMaterial(null);
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
    setNewMaterials({
      teacher_id: "",
    });
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedMaterial({ ...selectedMaterial, [name]: value });
  // };

  const handleNewMaterialsInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterials({ ...newMaterials, [name]: value });
  };

  const handleSave = async () => {
    // Lakukan penyimpanan data yang telah diedit
    try {
      const response = await fetch(
        `http://localhost:3000/api/edit-user/${selectedMaterial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedMaterial),
        }
      );
      const result = await response.json();
      if (result.success) {
        console.log("Data berhasil diupdate");
        // Perbarui data tabel dengan data yang diperbarui
        setData((prevData) =>
          prevData.map((material) =>
            material.id === selectedMaterial.id ? selectedMaterial : material
          )
        );
      } else {
        console.error("Gagal update data");
      }
    } catch (error) {
      console.error("Error update data:", error);
    }

    handleCloseEditPopup();
  };

  const handleDelete = async () => {
    // Lakukan penghapusan data
    try {
      const response = await fetch(
        `http://localhost:3000/api/delete-material/${selectedMaterial.id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Data berhasil dihapus");
        // Perbarui data tabel dengan menghapus data yang dihapus
        setData((prevData) =>
          prevData.filter((material) => material.id !== selectedMaterial.id)
        );
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error menghapus data:", error);
    }

    handleCloseDeletePopup();
  };

  const handleAddMaterials = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("teacher_id", newMaterials.teacher_id);
    formData.append("title", newMaterials.title);
    formData.append("content_type", newMaterials.content_type);
  
    if (newMaterials.content_type === "text") {
      formData.append("content_text", newMaterials.content_text);
    } else if (newMaterials.content_type === "pdf") {
      formData.append("name_pdf", newMaterials.name_pdf);
      formData.append("data_pdf", newMaterials.data_pdf);
      formData.append("mimetype_pdf", newMaterials.mimetype_pdf);
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/create-material", {
        method: "POST", 
        body: formData,
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Data berhasil ditambahkan");
        setData((prevData) => [...prevData, result.data]);
      } else {
        console.error("Gagal menambahkan data");
      }
    } catch (error) {
      console.error("Error menambahkan data:", error);
    }
  };
  

  return (
    <div>
      <button
        className="border rounded mb-4 border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-600 px-4 py-1 m-1"
        onClick={handleAddClick}
      >
        <i className="fa-solid fa-plus"></i> Material
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Teacher ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Content Type</th>
            <th className="border border-gray-300 px-4 py-2">Content</th>
            <th className="border border-gray-300 px-4 py-2">Create At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((material) => (
            <tr key={material.id}>
              <td className="border border-gray-300 px-4 py-2">
                {material.teacher_id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {material.title}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {material.content_type}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {/* {material.content} */}
                <button
                  className="bg-gray-600 py-2 px-4 border rounded-sm text-white text-sm"
                  onClick={() => handleShowContentClick(material)}
                >
                  Show Content
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {material.create_at}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="border rounded border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-4 py-1 m-1"
                  onClick={() => handleEditClick(material)}
                >
                  Edit
                </button>
                <button
                  className="border rounded border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700 px-4 py-1 m-1"
                  onClick={() => handleDeleteClick(material)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* show content */}
      {isShowContentOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Material Content</h2>
            {/* tampilkan material content content */}
            {selectedMaterial.content_text}
            <br />
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsShowContentOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* edit popup modal */}
      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form className="w-96">
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={selectedMaterial.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedMaterial.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={selectedMaterial.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">No HP</label>
                <input
                  type="text"
                  name="no_hp"
                  value={selectedMaterial.no_hp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedMaterial.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  name="role"
                  id="role"
                  className="w-full px-3 py-2 border rounded"
                  onChange={handleInputChange}
                  value={selectedMaterial.role}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleCloseEditPopup}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* delete popup modal */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleDelete}
              >
                Iya
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseDeletePopup}
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* add popup modal */}
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center py-[50px] justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Material</h2>
            <form onSubmit={handleAddMaterials}>
              <input
                type="text"
                name="title"
                value={newMaterials.title}
                onChange={handleInputChange}
                placeholder="Title"
              />

              <select
                name="content_type"
                value={newMaterials.content_type}
                onChange={(e) => {
                  handleInputChange(e);
                  setNewMaterials((prev) => ({
                    ...prev,
                    content_type: e.target.value,
                    content_text:
                      e.target.value === "text" ? "" : prev.content_text,
                    name_pdf: e.target.value === "pdf" ? "" : prev.name_pdf,
                    data_pdf: e.target.value === "pdf" ? "" : prev.data_pdf,
                    mimetype_pdf:
                      e.target.value === "pdf" ? "" : prev.mimetype_pdf,
                  }));
                }}
              >
                <option value="text">Text</option>
                <option value="pdf">PDF</option>
              </select>

              {newMaterials.content_type === "text" ? (
                <textarea
                  name="content_text"
                  value={newMaterials.content_text}
                  onChange={handleInputChange}
                  placeholder="Enter text content"
                />
              ) : (
                <input type="file" onChange={handleFileChange} />
              )}

              <button type="submit">Submit</button>
            </form>

            {/* <form className="w-96">
              <div className="mb-4">
                {" "}
                <label className="block text-gray-700">
                  Teacher ID <i className="text-green-800">* (Auto Fill)</i>
                </label>
                <input
                  type="text"
                  name="teacher_id"
                  value={teacher_id}
                  onChange={handleNewMaterialsInputChange}
                  className="w-full px-3 py-2 border rounded"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newMaterials.title}
                  onChange={handleNewMaterialsInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Content Type</label>
                <select
                  name="tipe-content"
                  id="tipe-content"
                  className="w-full px-3 py-2 border rounded"
                  value={contentType}
                  onChange={handleContentTypeChange}
                >
                  <option value="text">Text</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              {contentType === "text" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Content Text</label>
                  <textarea
                    name="content"
                    value={newMaterials.content}
                    onChange={handleNewMaterialsInputChange}
                    className="w-full px-3 py-2 border rounded resize-none h-[200px]"
                  ></textarea>
                </div>
              )}
              {contentType === "pdf" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Content PDF</label>
                  <input
                    type="file"
                    name="contentPdf"
                    className="w-full px-3 py-2 border rounded"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleAddMaterials}
                >
                  Tambahkan
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleCloseAddPopup}
                >
                  Cancel
                </button>
              </div>
            </form> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableMaterials;
