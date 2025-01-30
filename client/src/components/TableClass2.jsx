/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";

const TableClass = () => {
  const [data, setData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const teacher_id = localStorage.getItem("id");
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    teacher_id: teacher_id,
    students: [],
    materials: [],
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materialSearchQuery, setMaterialSearchQuery] = useState("");
  const [materialSearchResults, setMaterialSearchResults] = useState([]);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [dataViewStudentPopup, setDataViewStudentPopup] = useState([]);
  const [isViewStudentPopupOpen, setIsViewStudentPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [quizSearchQuery, setQuizSearchQuery] = useState("");
  const [quizSearchResults, setQuizSearchResults] = useState([]);

  useEffect(() => {
    // Fetch data from API when component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/class");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeletePopupOpen(true);
  };

  const handleAddClick = () => {
    setIsAddPopupOpen(true);
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedUser(null);
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
    setNewClass({
      name: "",
      description: "",
      teacher_id: teacher_id,
      students: [],
      materials: [],
    });
    setSelectedStudents([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleNewClassInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleSave = async () => {
    // Lakukan penyimpanan data yang telah diedit
    try {
      const response = await fetch(
        `http://localhost:3000/api/edit-user/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );
      const result = await response.json();
      if (result.success) {
        console.log("Data berhasil diupdate");
        // Perbarui data tabel dengan data yang diperbarui
        setData((prevData) =>
          prevData.map((user) =>
            user.id === selectedUser.id ? selectedUser : user
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
        `http://localhost:3000/api/delete-user/${selectedUser.id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.success) {
        console.log("Data berhasil dihapus");
        // Perbarui data tabel dengan menghapus data yang dihapus
        setData((prevData) =>
          prevData.filter((user) => user.id !== selectedUser.id)
        );
      } else {
        console.error("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error menghapus data:", error);
    }

    handleCloseDeletePopup();
  };

  const handleAddClass = async () => {
    const classData = {
      ...newClass,
      students: selectedStudents.map((student) => student.id),
      materials: selectedMaterials.map((material) => material.id),
      quizzes: selectedQuizzes.map((quiz) => quiz.id),
    };

    try {
      const response = await fetch("http://localhost:3000/api/add-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });
      const result = await response.json();
      if (result.success) {
        console.log("Data berhasil ditambahkan");
        // Perbarui data tabel dengan data yang baru ditambahkan
        setData((prevData) => [...prevData, result.data]);
      } else {
        console.error("Gagal menambahkan data");
      }
    } catch (error) {
      console.error("Error menambahkan data:", error);
    }

    handleCloseAddPopup();
  };

  const handleAddStudent = (student) => {
    setSelectedStudents((prevStudents) => [...prevStudents, student]);
    setIsStudentModalOpen(false);
  };

  const handleAddMaterial = (material) => {
    setSelectedMaterials((prevMaterials) => [...prevMaterials, material]);
    setIsMaterialModalOpen(false);
  };

  const handleAddQuiz = (quiz) => {
    setSelectedQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
    setIsQuizModalOpen(false);
  };

  const handleOpenStudentModal = () => {
    setIsStudentModalOpen(true);
  };

  const handleOpenMaterialModal = () => {
    setIsMaterialModalOpen(true);
  };

  const handleOpenQuizModal = () => {
    setIsQuizModalOpen(true);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users?search=${query}`
        );
        const result = await response.json();
        setSearchResults(
          result.data.filter((user) => user.username.includes(query))
        );
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // function untuk menangani search quiz
  const handleQuizSearchChange = async (e) => {
    const query = e.target.value;
    setQuizSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/quiz?search=${query}`
        );
        const result = await response.json();
        setQuizSearchResults(
          result.data.filter((quiz) => quiz.title.includes(query))
        );
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setQuizSearchResults([]);
    }
  };

  const handleMaterialSearchChange = async (e) => {
    const query = e.target.value;
    setMaterialSearchQuery(query);

    if (query.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/materials?search=${query}`
        );
        const result = await response.json();
        setMaterialSearchResults(
          result.data.filter((material) => material.title.includes(query))
        );
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setMaterialSearchResults([]);
    }
  };

  // function untuk melihat semua student dalam class
  const handleViewStudentInClass = async (selectedClassId) => {
    // Implement view student in class functionality here
    const response = await fetch(
      `http://localhost:3000/api/detail-class/${selectedClassId}`
    );
    const result = await response.json();
    console.log(result);

    // Ambil ID students
    const studentIds = result.data.students;

    // Fetch detail data untuk setiap student ID (dari API user2)
    const studentDetailsPromises = studentIds.map(async (id) => {
      const userResponse = await fetch(`http://localhost:3000/api/users/${id}`);
      const userData = await userResponse.json();
      return { id, username: userData.username }; // Pastikan userData memiliki username
    });

    // Tunggu hingga semua data selesai diambil
    const studentDetails = await Promise.all(studentDetailsPromises);

    // Simpan data dengan username
    setDataViewStudentPopup(studentDetails);
    setIsViewStudentPopupOpen(true);
  };

  return (
    <>
      <button
        className="border rounded border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-600 px-4 py-1 m-1"
        onClick={handleAddClick}
      >
        Add New Class
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Teacher ID</th>
            <th className="border border-gray-300 px-4 py-2">Students</th>
            <th className="border border-gray-300 px-4 py-2">Materials</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((classes) => (
            <tr key={classes.id}>
              <td className="border border-gray-300 px-4 py-2">
                {classes.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classes.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classes.teacher_id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classes.student_count}{" "}
                <i
                  className="fa-regular fa-eye hover:cursor-pointer"
                  onClick={() => handleViewStudentInClass(classes.id)}
                ></i>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {classes.material_count}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="border rounded border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-4 py-1 m-1"
                  onClick={() => handleEditClick(classes)}
                >
                  Edit
                </button>
                <button
                  className="border rounded border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700 px-4 py-1 m-1"
                  onClick={() => handleDeleteClick(classes)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* view student popup modal */}
      {isViewStudentPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Students in Class</h2>

            <ul>
              {dataViewStudentPopup.map((student) => (
                <li key={student.id}>{student.username}</li>
              ))}
            </ul>
            {/* <ul>{dataViewStudentPopup}</ul> */}
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsViewStudentPopupOpen(false)}
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
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={selectedUser.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={selectedUser.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">No HP</label>
                <input
                  type="text"
                  name="no_hp"
                  value={selectedUser.no_hp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={selectedUser.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll py-5">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Class</h2>
            <form className="w-96">
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newClass.name}
                  onChange={handleNewClassInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newClass.description}
                  onChange={handleNewClassInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teacher ID</label>
                <input
                  type="text"
                  name="teacher_id"
                  value={newClass.teacher_id}
                  onChange={handleNewClassInputChange}
                  className="w-full px-3 py-2 border rounded bg-gray-200 hover:cursor-pointer"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Students</label>
                <button
                  type="button"
                  onClick={handleOpenStudentModal}
                  className="w-full px-3 py-2 border rounded bg-gray-200"
                >
                  Add Students
                </button>
                <ul className="mt-4">
                  {selectedStudents.map((student) => (
                    <li
                      key={student.id}
                      className="flex justify-between items-center border-b border-gray-300 py-2"
                    >
                      <span>{student.username}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Materials</label>
                <button
                  type="button"
                  onClick={handleOpenMaterialModal}
                  className="w-full px-3 py-2 border rounded bg-gray-200"
                >
                  Add Materials
                </button>
                <ul className="mt-4">
                  {selectedMaterials.map((material) => (
                    <li
                      key={material.id}
                      className="flex justify-between items-center border-b border-gray-300 py-2"
                    >
                      <span>{material.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quizzes</label>
                <button
                  type="button"
                  onClick={handleOpenQuizModal}
                  className="w-full px-3 py-2 border rounded bg-gray-200"
                >
                  Add Quizzes
                </button>
                <ul className="mt-4">
                  {selectedQuizzes.map((quiz) => (
                    <li
                      key={quiz.id}
                      className="flex justify-between items-center border-b border-gray-300 py-2"
                    >
                      <span>{quiz.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleAddClass}
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
            </form>
          </div>
        </div>
      )}

      {/* add student for class popup modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Students</h2>
            <input
              type="text"
              placeholder="Search student"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border rounded"
            />
            <ul className="mt-4">
              {searchResults.map((student) => (
                <li
                  key={student.id}
                  className="flex justify-between items-center border-b border-gray-300 py-2"
                >
                  <span>{student.username}</span>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => handleAddStudent(student)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsStudentModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* add material for class popup modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Materials</h2>
            <input
              type="text"
              placeholder="Search material"
              value={materialSearchQuery}
              onChange={handleMaterialSearchChange}
              className="w-full px-3 py-2 border rounded"
            />
            <ul className="mt-4">
              {materialSearchResults.map((material) => (
                <li
                  key={material.id}
                  className="flex justify-between items-center border-b border-gray-300 py-2"
                >
                  <span>{material.title}</span>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => handleAddMaterial(material)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsMaterialModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* add quiz for class popup modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Quizzes</h2>
            <input
              type="text"
              placeholder="Search quiz"
              value={quizSearchQuery}
              onChange={handleQuizSearchChange}
              className="w-full px-3 py-2 border rounded"
            />
            <ul className="mt-4">
              {quizSearchResults.map((quiz) => (
                <li
                  key={quiz.id}
                  className="flex justify-between items-center border-b border-gray-300 py-2"
                >
                  <span>{quiz.title}</span>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                    onClick={() => handleAddQuiz(quiz)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsQuizModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TableClass;
