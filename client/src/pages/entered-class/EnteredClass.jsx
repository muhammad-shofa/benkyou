/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EnteredClass() {
  const navigate = useNavigate();
  const { class_id } = useParams();

  // Fetch data class berdasarkan class_id
  // Contoh fetch menggunakan useEffect dan useState
  const [classData, setClassData] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  console.log("ini state classData : ", classData);
  console.log("ini state selectedMaterial : ", selectedMaterial);
  // console.log("ini materials id pada state classData : ", classData.materials._id);
  const [dataViewStudentPopup, setDataViewStudentPopup] = useState([]);
  console.log(
    "ini data view student dari Entered Class : ",
    dataViewStudentPopup
  );
  const [isViewStudentPopupOpen, setIsViewStudentPopupOpen] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/entered-class/${class_id}`
        );
        const result = await response.json();
        if (result.success) {
          setClassData(result.data);
          setSelectedMaterial(result.data.materials);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Ganti dengan fetch dari API atau sumber data
    // fetch(`http://localhost:3000/api/entered-class/${class_id}`)
    //   .then((response) => response.json())
    //   .then((data) => setClassData(data));
  }, [class_id]);

  // useEffect(() => {
  //   // ambil data
  // }, []);

  // if (classData !== null) {
  //   fetchContentMaterials(classData.materials);
  // }

  // const fetchContentMaterials = async (ids) => {

  // };

  // jika belum ada data maka tampilkan loading
  if (!classData) return <div>Loading...</div>;

  const handleCloseClass = () => {
    navigate("/class-dashboard");
  };

  const handleTakeQuiz = (quiz_id) => {
    // console.log("Take quiz with ID:", quiz_id);
    navigate(`/take-quiz/${quiz_id}`);
  };

  // function untuk menangani download file ketika icon "download" diklik
  const handleDownload = async (material_id, name_pdf) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/download-pdf/${material_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name_pdf; // Nama file yang akan diunduh
      // a.download = selectedMaterial.name_pdf; // Nama file yang akan diunduh
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // useEffect(() => {
  //   if (dataViewStudentPopup && dataViewStudentPopup.length > 0) {
  //     fetchStudents(dataViewStudentPopup); // data parameternya dalam bentuk array
  //   }
  // }, [dataViewStudentPopup]); // diberikan hook

  // function checkDataViewStudents(() => {
  // if (dataViewStudentPopup && dataViewStudentPopup.length > 0) {
  //   fetchStudents(dataViewStudentPopup); // data parameternya dalam bentuk array
  // }
  // });

  // function untuk melihat semua student dalam class
  // const handleViewStudentInClass = async (selectedClassId) => {
  //   // Implement view student in class functionality here
  //   const response = await fetch(
  //     `http://localhost:3000/api/detail-class/${selectedClassId}`
  //   );
  //   const result = await response.json();
  //   console.log(result);
  //   setIsViewStudentPopupOpen(true);
  //   fetchStudents(result.data.students);
  // };

  // function untuk melihat semua student dalam class LATEST
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

  // function untuk mengambil data Students berdasarakan id dari collection Class tertentu
  const fetchStudents = async (ids) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/getUsersByIds",
        { ids }
      );
      console.log("Response data:", response.data); // Log data
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  //  function untuk mengambil data material tertentu berdasarkan id dari collection Class tertentu

  return (
    <div>
      <Navbar />
      <div className="p-[10px]">
        <div className="w-100 min-h-[80vh] p-2 bg-gray-200 rounded">
          {/* name of class and button close class */}
          <div className="flex justify-between flex-wrap p-2 bg-gray-300">
            <div>
              <button
                className="p-2 m-4 bg-yellow-500 rounded"
                onClick={() => handleCloseClass()}
              >
                <i
                  className="fa-solid fa-door-open"
                  style={{ color: "#ffffff" }}
                ></i>
              </button>
            </div>
            <div className="name-class text-end block">
              <h1 className="text-4xl">
                <b>{classData.name}</b>
              </h1>
              <div className="flex items-center justify-end">
                <p className="mx-2">{classData.teacher.name}</p>
                <img
                  src={`http://localhost:3000/${classData.teacher.profile_picture}`}
                  alt="teacher PP"
                  className="w-[45px] rounded-full border-[5px] border-green-500"
                />
              </div>
              <p
                className="hover:cursor-pointer "
                onClick={() => handleViewStudentInClass(classData._id)}
              >
                View Students
                <i className="fa-regular fa-eye mx-1"></i>
              </p>
            </div>
          </div>

          <div className="p-4 my-5 rounded bg-gray-300">
            <h3 className="text-xl">Descriptions</h3>
            <p>{classData.description}</p>
          </div>
          {/* <p>teacher id :{classData.teacher_id}</p> */}
          {/* Loop melalui data materials untuk menampilkan ID */}
          {classData.materials.map((material) => (
            <div key={material._id} className="p-4 my-5 rounded bg-gray-300">
              {/* <p>Materials id : {material._id}</p> */}
              <p>Materials type : {material.content_type}</p>
              {material.content_type == "text" ? (
                <div>
                  <p>Materials text : {material.content_text}</p>
                </div>
              ) : (
                <div>
                  {material.name_pdf}
                  <i
                    className="fa-solid fa-download bg-green-600 p-2 rounded m-1 hover:cursor-pointer"
                    style={{ color: "white" }}
                    onClick={() =>
                      handleDownload(material._id, material.name_pdf)
                    }
                  ></i>
                  {/* <p>Materials name pdf : {material.name_pdf}</p> */}
                </div>
              )}
            </div>
          ))}

          {/* tombol untuk mengarahkan user ke halaman untuk mengerjakan quiz */}
          {classData.quizzes.map((quiz) => (
            <button
              key={quiz._id}
              onClick={() => handleTakeQuiz(quiz._id)}
              className="border rounded border-purple-600 bg-purple-600 text-white hover:bg-white hover:text-purple-600 px-4 py-1 m-1"
            >
              Kerjakan Quiz
            </button>
          ))}
        </div>
      </div>

      {/* view student popup modal latest */}
      {isViewStudentPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Students in Class</h2>
            <ul>
              {dataViewStudentPopup.map((student) => (
                <li key={student.id}>{student.username}</li>
              ))}
            </ul>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsViewStudentPopupOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* view student popup modal */}
      {/* {isViewStudentPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Students in Class</h2>
            <ul>
              {students.map((student) => (
                <li key={student.id}>{student.username}</li>
              ))}
            </ul>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setIsViewStudentPopupOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default EnteredClass;
