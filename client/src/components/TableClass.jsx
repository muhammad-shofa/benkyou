/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import { useNavigate } from "react-router-dom";

const TableClass = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const userRole = localStorage.getItem("role");
  console.log(userRole);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const teacher_id = localStorage.getItem("id");
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    teacher_id: teacher_id,
    students: [],
    materials: [],
    quizzes: [],
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  // console.log("Ini selectedMaterials :", selectedMaterials); // NANTI HAPUS
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [materialSearchQuery, setMaterialSearchQuery] = useState("");
  const [materialSearchResults, setMaterialSearchResults] = useState([]);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [dataViewStudentPopup, setDataViewStudentPopup] = useState([]);
  const [isViewStudentPopupOpen, setIsViewStudentPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizSearchQuery, setQuizSearchQuery] = useState("");
  const [quizSearchResults, setQuizSearchResults] = useState([]);

  const [editClass, setEditClass] = useState(null);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [editSelectedStudents, setEditSelectedStudents] = useState([]);
  const [editSelectedMaterials, setEditSelectedMaterials] = useState([]);
  const [editSelectedQuizzes, setEditSelectedQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRole = localStorage.getItem("role");
        const userId = localStorage.getItem("id");

        const response = await fetch(
          `http://localhost:3000/api/class?role=${userRole}&id=${userId}`
        );

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   // Fetch data from API when component mounts
  //   const fetchData = async () => {
  //     if (userRole == "student") {
  //       try {
  //         const response = await fetch("http://localhost:3000/api/class");
  //         const result = await response.json();
  //         setData(result.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     } else if (userRole == "teacher") {
  //       try {
  //         const response = await fetch("http://localhost:3000/api/class");
  //         const result = await response.json();
  //         setData(result.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     } else if (userRole == "admin") {
  //       try {
  //         const response = await fetch("http://localhost:3000/api/class");
  //         const result = await response.json();
  //         setData(result.data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     }

  //   };

  //   fetchData();
  // }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const handleEditClick = (classData) => {
  //   console.log("Ini struktur data dari classData :", classData);
  //   setEditClass({
  //     ...classData,
  //     students: classData.students || [],
  //     materials: classData.materials || [],
  //     quizzes: classData.quizzes || [],
  //   });
  //   setEditSelectedStudents(classData.students || []);
  //   // console.log(classData.students);
  //   setEditSelectedMaterials(classData.materials || []);
  //   setEditSelectedQuizzes(classData.quizzes || []);
  //   setIsEditClassModalOpen(true);
  // };

  // function untuk menangani enter class
  const handleEnterClass = (classId) => {
    console.log("Enter class with ID:", classId);
    navigate(`/entered-class/${classId}`);
  };

  const handleDeleteClick = (classes) => {
    setSelectedClass(classes);
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
      quizzes: [],
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
        `http://localhost:3000/api/delete-class/${selectedClass.id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.success) {
        console.log("Data berhasil dihapus");
        // Perbarui data tabel dengan menghapus data yang dihapus
        setData((prevData) =>
          prevData.filter((classes) => classes.id !== selectedClass.id)
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
      students: selectedStudents.map((student) => student._id),
      materials: selectedMaterials.map((material) => material._id),
      quizzes: selectedQuizzes.map((quiz) => quiz._id),
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
      console.log(result.data);
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
    // console.log("ini data students setelah ditambahkan sementara", stud);
    setSelectedStudents((prevStudents) => [...prevStudents, student]);
    setEditSelectedStudents((prevStudents) => [...prevStudents, student]);
    setIsStudentModalOpen(false);
  };

  const handleAddMaterial = (material) => {
    console.log("Ini material yang dipilih :", material);
    setSelectedMaterials((prevMaterials) => [...prevMaterials, material]);
    setEditSelectedMaterials((prevMaterials) => [...prevMaterials, material]);
    setIsMaterialModalOpen(false);
  };

  const handleAddQuiz = (quiz) => {
    console.log("Ini quiz yang dipilih :", quiz);
    // console.log("Ini id quiz yang dipilih :", quiz._id);
    setSelectedQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
    setEditSelectedQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
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
        console.log("Data search results students :", result);
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

        // Simpan semua data material yang relevan (termasuk _id)
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
    console.log(selectedClassId);
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

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== studentId)
    );
  };

  const handleRemoveMaterial = (materialId) => {
    setSelectedMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== materialId)
    );
  };

  const handleRemoveQuiz = (quizId) => {
    setSelectedQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.id !== quizId)
    );
  };

  const handleEditClassInputChange = (e) => {
    const { name, value } = e.target;
    setEditClass({ ...editClass, [name]: value });
  };

  const handleEditAddStudent = (student) => {
    setEditSelectedStudents((prevStudents) => [...prevStudents, student]);
    setIsStudentModalOpen(false);
  };

  const handleEditAddMaterial = (material) => {
    setEditSelectedMaterials((prevMaterials) => [...prevMaterials, material]);
    setIsMaterialModalOpen(false);
  };

  const handleEditAddQuiz = (quiz) => {
    setEditSelectedQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
    setIsQuizModalOpen(false);
  };

  const handleEditRemoveStudent = (studentId) => {
    setEditSelectedStudents((prevStudents) =>
      prevStudents.filter((student) => student._id !== studentId)
    );
  };

  const handleEditRemoveMaterial = (materialId) => {
    setEditSelectedMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material._id !== materialId)
    );
  };

  const handleEditRemoveQuiz = (quizId) => {
    setEditSelectedQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz._id !== quizId)
    );
  };

  // const handleSaveEditClass = async () => {
  //   const classData = {
  //     ...editClass,
  //     students: editSelectedStudents.map((student) => student.id),
  //     materials: editSelectedMaterials.map((material) => material.id),
  //     quizzes: editSelectedQuizzes.map((quiz) => quiz.id),
  //   };

  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/edit-class/${editClass.id}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(classData),
  //       }
  //     );
  //     const result = await response.json();
  //     if (result.success) {
  //       console.log("Data berhasil diupdate");
  //       setData((prevData) =>
  //         prevData.map((classItem) =>
  //           classItem.id === editClass.id ? result.data : classItem
  //         )
  //       );
  //     } else {
  //       console.error("Gagal update data");
  //     }
  //   } catch (error) {
  //     console.error("Error update data:", error);
  //   }

  //   setIsEditClassModalOpen(false);
  // };

  // KODE EDIT DAN SAVE EDIT TERBARU START
  // KODE EDIT DAN SAVE EDIT TERBARU START
  // KODE EDIT DAN SAVE EDIT TERBARU START
  // Mengambil data kelas dan menampilkan di modal edit
  // const handleOpenEditClassModal = async (classId) => {
  //   try {
  //     // Panggil API untuk mendapatkan data kelas
  //     const response = await fetch(
  //       `http://localhost:3000/api/edit-class/${classId}`
  //     );
  //     const data = await response.json();

  //     if (data.success) {
  //       setEditClass({
  //         name: data.data.name,
  //         description: data.data.description,
  //         teacher_id: data.data.teacher_id,
  //         students: data.data.students,
  //         materials: data.data.materials,
  //         quizzes: data.data.quizzes,
  //       });

  //       // Set edit selected students, materials, and quizzes
  //       setEditSelectedStudents(data.data.students);
  //       setEditSelectedMaterials(data.data.materials);
  //       setEditSelectedQuizzes(data.data.quizzes);
  //       setIsEditClassModalOpen(true);
  //     }
  //   } catch (error) {
  //     console.error("Error opening edit class modal:", error);
  //   }
  // };

  const handleOpenEditClassModal = async (classId) => {
    try {
      // Panggil API untuk mendapatkan data kelas
      const response = await fetch(
        `http://localhost:3000/api/edit-class/${classId}`
      );
      const data = await response.json();

      if (data.success) {
        setEditClass({
          name: data.data.name,
          description: data.data.description,
          teacher_id: data.data.teacher_id,
          students: data.data.students,
          materials: data.data.materials,
          quizzes: data.data.quizzes,
        });
        console.log("Data kelas yang diambil :", data.data);

        // Set edit selected students, materials, and quizzes
        setEditSelectedStudents(data.data.students);
        // setSelectedStudents((prevStudents) => [
        //   ...prevStudents,
        //   data.data.students,
        // ]);
        setEditSelectedMaterials(data.data.materials);
        // console.log("Data material yang diambil :", data.data.materials);
        setEditSelectedQuizzes(data.data.quizzes);
        setIsEditClassModalOpen(true);
      }
    } catch (error) {
      console.error("Error opening edit class modal:", error);
    }
  };

  // Fungsi untuk menyimpan perubahan edit class
  const handleSaveEditClass = async () => {
    try {
      // Siapkan data kelas yang diperbarui
      const updatedClass = {
        ...editClass,
        students: editSelectedStudents.map((student) => student._id), // Ambil _id dari siswa
        materials: editSelectedMaterials.map((material) => material._id), // Ambil _id dari materi
        quizzes: editSelectedQuizzes.map((quiz) => quiz._id), // Ambil _id dari kuis
      };

      console.log(updatedClass);

      // Lakukan permintaan ke API untuk menyimpan perubahan
      const response = await fetch(
        `http://localhost:3000/api/save-edit-class/${editClass.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedClass),
        }
      );

      // Periksa respons dari server
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Jika berhasil, tutup modal dan tampilkan pesan sukses
        setIsEditClassModalOpen(false);
        console.log("Class updated successfully:", data.message);
      } else {
        // Tangani jika respons tidak berhasil
        console.error("Failed to update class:", data.message);
        alert(`Failed to update class: ${data.message}`);
      }
    } catch (error) {
      // Tangani error saat menyimpan data
      console.error("Error saving edited class:", error);
      alert(`Error saving edited class: ${error.message}`);
    }
  };

  // const handleSaveEditClass = async () => {
  //   try {
  //     const updatedClass = {
  //       ...editClass,
  //       students: editSelectedStudents.map((student) => student._id),
  //       materials: editSelectedMaterials.map((material) => material._id),
  //       quizzes: editSelectedQuizzes.map((quiz) => quiz._id),
  //     };

  //     const response = await fetch(`/api/classes/${editClass.id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(updatedClass),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       setIsEditClassModalOpen(false);
  //     }
  //   } catch (error) {
  //     console.error("Error saving edited class:", error);
  //   }
  // };
  // KODE EDIT DAN SAVE EDIT TERBARU END
  // KODE EDIT DAN SAVE EDIT TERBARU END
  // KODE EDIT DAN SAVE EDIT TERBARU END

  const renderTableClassContentByRole = () => {
    switch (userRole) {
      case "student":
        return (
          <>
        
            {data.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                    {/* <th className="border border-gray-300 px-4 py-2">
                      Teacher ID
                    </th> */}
                    {/* <th className="border border-gray-300 px-4 py-2">
                      Students
                    </th> */}
                    {/* <th className="border border-gray-300 px-4 py-2">
                      Materials
                    </th> */}
                    {/* <th className="border border-gray-300 px-4 py-2">
                      Quizzes
                    </th> */}
                    <th className="border border-gray-300 px-4 py-2">
                      Enter Class
                    </th>
                    {/* <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th> */}
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
                      {/* <td className="border border-gray-300 px-4 py-2">
                        {classes.teacher_id}
                      </td> */}
                      {/* <td className="border border-gray-300 px-4 py-2">
                        {classes.student_count}{" "}
                        <i
                          className="fa-regular fa-eye hover:cursor-pointer"
                          onClick={() => handleViewStudentInClass(classes.id)}
                        ></i>
                      </td> */}
                      {/* <td className="border border-gray-300 px-4 py-2">
                        {classes.material_count}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {classes.quizzes_count}
                      </td> */}
                      <td>
                        <button
                          className="border rounded border-yellow-600 bg-yellow-600 text-white hover:bg-white hover:text-yellow-600 px-4 py-1 m-1"
                          onClick={() => handleEnterClass(classes.id)}
                        >
                          Enter
                        </button>
                      </td>
                      {/* <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="border rounded border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-4 py-1 m-1"
                          onClick={() => handleOpenEditClassModal(classes.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="border rounded border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700 px-4 py-1 m-1"
                          onClick={() => handleDeleteClick(classes)}
                        >
                          Hapus
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Belum ada class</p>
            )}
          </>
        );
      case "teacher":
        return (
          <>
            <button
              className="border rounded border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-600 px-4 py-1 m-1"
              onClick={handleAddClick}
            >
              Add New Class
            </button>
            {data.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Teacher ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Students
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Materials
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Quizzes
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Enter Class
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((classes) => (
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
                          {classes.quizzes_count}
                        </td>
                        <td>
                          <button
                            className="border rounded border-yellow-600 bg-yellow-600 text-white hover:bg-white hover:text-yellow-600 px-4 py-1 m-1"
                            onClick={() => handleEnterClass(classes.id)}
                          >
                            Enter
                          </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            className="border rounded border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-4 py-1 m-1"
                            onClick={() => handleOpenEditClassModal(classes.id)}
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
                    ))
                  ) : (
                    <p>Belum ada class</p>
                  )}
                </tbody>
              </table>
            ) : (
              <p>Belum ada class</p>
            )}
          </>
        );
      case "admin":
        return (
          <>
            <button
              className="border rounded border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-600 px-4 py-1 m-1"
              onClick={handleAddClick}
            >
              Add New Class
            </button>
            {data.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Teacher ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Students
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Materials
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Quizzes
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Enter Class
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
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
                        {classes.quizzes_count}
                      </td>
                      <td>
                        <button
                          className="border rounded border-yellow-600 bg-yellow-600 text-white hover:bg-white hover:text-yellow-600 px-4 py-1 m-1"
                          onClick={() => handleEnterClass(classes.id)}
                        >
                          Enter
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="border rounded border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-4 py-1 m-1"
                          onClick={() => handleOpenEditClassModal(classes.id)}
                          // onClick={() => handleEditClick(classes)}
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
            ) : (
              <p>Belum ada class</p>
            )}

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

            {/* edit class popup modal */}

            {isEditClassModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll py-5">
                <div className="bg-white p-4 rounded shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Edit Class</h2>
                  <form className="w-96">
                    <div className="mb-4">
                      <label className="block text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editClass.name}
                        onChange={handleEditClassInputChange}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={editClass.description}
                        onChange={handleEditClassInputChange}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Teacher ID</label>
                      <input
                        type="text"
                        name="teacher_id"
                        value={editClass.teacher_id}
                        onChange={handleEditClassInputChange}
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
                        {editSelectedStudents.map((student, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                          >
                            <span>{student.username}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() =>
                                handleEditRemoveStudent(student._id)
                              }
                            >
                              &times;
                            </button>
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
                        {editSelectedMaterials.map((material, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                          >
                            <span>{material.title}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() =>
                                handleEditRemoveMaterial(material._id)
                              }
                            >
                              &times;
                            </button>
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
                        {editSelectedQuizzes.map((quiz, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                          >
                            <span>{quiz.title}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleEditRemoveQuiz(quiz._id)}
                            >
                              &times;
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={handleSaveEditClass}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsEditClassModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* {isEditClassModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll py-5">
            <div className="bg-white p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Class</h2>
              <form className="w-96">
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editClass.name}
                    onChange={handleEditClassInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={editClass.description}
                    onChange={handleEditClassInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Teacher ID</label>
                  <input
                    type="text"
                    name="teacher_id"
                    value={editClass.teacher_id}
                    onChange={handleEditClassInputChange}
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
                    {editSelectedStudents.map((student) => (
                      <li
                        key={student.id}
                        className="flex justify-between items-center border-b border-gray-300 py-2"
                      >
                        <span>{student.username}</span>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => handleEditRemoveStudent(student.id)}
                        >
                          &times;
                        </button>
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
                    {editSelectedMaterials.map((material) => (
                      <li
                        key={material.id}
                        className="flex justify-between items-center border-b border-gray-300 py-2"
                      >
                        <span>{material.title}</span>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => handleEditRemoveMaterial(material.id)}
                        >
                          &times;
                        </button>
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
                    {editSelectedQuizzes.map((quiz) => (
                      <li
                        key={quiz.id}
                        className="flex justify-between items-center border-b border-gray-300 py-2"
                      >
                        <span>{quiz.title}</span>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => handleEditRemoveQuiz(quiz.id)}
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    onClick={handleSaveEditClass}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsEditClassModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )} */}

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
                        {selectedStudents.map((student, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                          >
                            <span>{student.username}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleRemoveStudent(student.id)}
                            >
                              &times;
                            </button>
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
                        {selectedMaterials.map((material, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                          >
                            <span>{material.title}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleRemoveMaterial(material.id)}
                            >
                              &times;
                            </button>
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
                        {selectedQuizzes.map((quiz, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                          >
                            <span>{quiz.title}</span>
                            <button
                              type="button"
                              className="text-red-500"
                              onClick={() => handleRemoveQuiz(quiz.id)}
                            >
                              &times;
                            </button>
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
                    {searchResults.map((student, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center border-b border-gray-300 py-2"
                      >
                        {/* <span>{student.id}</span> */}
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
                    {materialSearchResults.map((material, index) => (
                      <li
                        key={index}
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
      default:
        return <p>Sorry, You have invalid role.</p>;
    }
  };

  return (
    <>
      {/* reder content sesuai role */}
      {renderTableClassContentByRole()}
    </>
  );
};

export default TableClass;
