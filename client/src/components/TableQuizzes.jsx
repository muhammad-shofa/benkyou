/* eslint-disable no-unused-vars */
// src/components/Table.js
import React, { useEffect, useState } from "react";
import AddQuizModal from "./AddQuizModal";

const TableQuizzes = () => {
  const [data, setData] = useState([]);
  console.log("data quiz saat ini : ", data);
  const [contentType, setContentType] = useState("text");

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isModalDetailsQuestionOpen, setIsModalDetailsQuestionOpen] =
    useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const teacher_id = localStorage.getItem("id");
  const [newQuizzes, setNewQuizzes] = useState({
    class_id: "",
    teacher_id: teacher_id,
    title: "",
    questions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/quiz");
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

  // function untuk menangani ketika select option pada Type Content diubah
  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
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
    setNewQuizzes({
      teacher_id: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedMaterial({ ...selectedMaterial, [name]: value });
  };

  const handleNewQuizzesInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuizzes({ ...newQuizzes, [name]: value });
  };

  // function untuk mengambil details question berdaasarkan id tertentu
  const handleDetailsClick = async (quiz_id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/quiz/${quiz_id}`);
      const result = await response.json();
      if (result.success) {
        // setSelectedQuestion(result);
        setSelectedQuestion(result.quiz);
        setIsModalDetailsQuestionOpen(true);
      } else {
        console.error("Failed to fetch quiz details");
      }
    } catch (error) {
      console.error("Error fetching quiz details:", error);
    }
  };

  // save untuk edit
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

  // const handleAddQuizzes = async () => {
  //   // Lakukan penyimpanan data quiz baru
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/api/create-quiz", // Buat routenya di backend
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newQuizzes),
  //       }
  //     );
  //     const result = await response.json();
  //     if (result.success) {
  //       alert("Data berhasil ditambahkan");
  //       console.log("Data berhasil ditambahkan");
  //       // Perbarui data tabel dengan data yang baru ditambahkan
  //       setData((prevData) => [...prevData, result.data]);
  //     } else {
  //       console.error("Gagal menambahkan data");
  //     }
  //   } catch (error) {
  //     console.error("Error menambahkan data:", error);
  //   }

  //   handleCloseAddPopup();
  // };

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  // Menambahkan pertanyaan baru
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question_text: "", option: ["", "", "", ""], correct_answer: "" },
    ]);
  };

  // Mengubah nilai pertanyaan
  const updateQuestionText = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question_text = value;
    setQuestions(updatedQuestions);
  };

  // Mengubah opsi jawaban
  const updateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].option[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Mengubah jawaban benar
  const updateCorrectAnswer = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correct_answer = value;
    setQuestions(updatedQuestions);
  };

  // function untuk menambahkan question baru
  const handleSaveQuiz = async () => {
    const newQuiz = {
      teacher_id: teacher_id,
      title,
      questions,
      created_at: new Date().toISOString(),
    };

    console.log("Data quiz baru : ", newQuiz);

    try {
      const response = await fetch("http://localhost:3000/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuiz),
      });

      const data = await response.json();
      console.log("data dari hasil response tambah quiz : ", data);
      if (data.success) {
        alert("Quiz added successfully!");
        setShowModal(false);
      } else {
        alert("Failed to add quiz.");
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  // Menyimpan quiz
  // const handleSave = () => {
  //   const newQuiz = {
  //     teacher_id: teacher_id,
  //     title,
  //     questions,
  //     created_at: new Date().toISOString(),
  //   };
  //   onSave(newQuiz);
  // };

  return (
    <div>
      <button
        className="border rounded mb-4 border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-600 px-4 py-1 m-1"
        onClick={() => setShowModal(true)}
      >
        <i className="fa-solid fa-plus"></i> Quiz
      </button>
      {/* <div className="border border-red-300 rounded p-5">
        {showModal && (
          <AddQuizModal
            onClose={() => setShowModal(false)}
            onSave={handleSaveQuiz}
          />
        )}
      </div> */}
      {/* <button
        className="border rounded mb-4 border-green-500 bg-green-500 text-white hover:bg-white hover:text-green-600 px-4 py-1 m-1"
        onClick={handleAddClick}
      >
        <i className="fa-solid fa-plus"></i> Quiz
      </button> */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Teacher ID</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Questions</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((quiz) => (
            <tr key={quiz._id}>
              <td className="border border-gray-300 px-4 py-2">
                {quiz.teacher_id}
              </td>
              <td className="border border-gray-300 px-4 py-2">{quiz.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-gray-500 py-2 px-4 rounded text-white"
                  onClick={() => handleDetailsClick(quiz._id)}
                >
                  Details
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {quiz.created_at}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="border rounded border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600 px-4 py-1 m-1"
                  onClick={() => handleEditClick(quiz)}
                >
                  Edit
                </button>
                <button
                  className="border rounded border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700 px-4 py-1 m-1"
                  onClick={() => handleDeleteClick(quiz)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* details question popup modal */}
      {isModalDetailsQuestionOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Question Details</h2>
            <div className="bg-gray-200 p-2 rounded max-h-[80vh] overflow-y-auto">
              <h3 className="mx-3">
                <strong>{selectedQuestion.title}</strong>
              </h3>

              <ul className="list-none">
                {selectedQuestion.questions.map((question, index) => (
                  <li key={index} className="mb-4">
                    <p>
                      <strong>{index + 1}. Question:</strong>{" "}
                      {question.question_text}
                    </p>
                    <p>
                      <strong>Options:</strong>
                    </p>
                    <ul className="list-disc ml-6">
                      {question.option.map((opt, optIndex) => (
                        <li key={optIndex} className="ml-2">
                          {String.fromCharCode(97 + optIndex)}. {opt}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Correct Answer:</strong> {question.correct_answer}
                      {/* {String.fromCharCode(97 + question.correct_answer)} */}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
              onClick={() => setIsModalDetailsQuestionOpen(false)}
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

      {/* add popup modal quiz 3 */}

      {/* add popup modal quiz 2 */}
      {/* {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Quiz</h2>

            <form>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Teacher ID <i className="text-green-800">* (Auto Fill)</i>
                </label>
                <input
                  type="text"
                  name="teacher_id"
                  value={teacher_id}
                  className="w-full px-3 py-2 border rounded bg-gray-200"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter quiz title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Content Type</label>
                <select
                  name="contentType"
                  className="w-full px-3 py-2 border rounded"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded resize-none h-32"
                    placeholder="Enter content text"
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
                    onChange={(e) => setContentPdf(e.target.files[0])}
                  />
                </div>
              )}

              <h3 className="text-lg font-bold mt-6">Questions</h3>
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="mb-4 p-3 border rounded bg-gray-50"
                >
                  <label className="block text-gray-700">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={q.question_text}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter question"
                  />
                  <div className="mt-2">
                    {q.options.map((opt, oIndex) => (
                      <input
                        key={oIndex}
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded mb-1"
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    ))}
                  </div>
                  <label className="block text-gray-700 mt-2">
                    Correct Answer
                  </label>
                  <select
                    value={q.correct_answer}
                    onChange={(e) =>
                      updateCorrectAnswer(qIndex, e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select correct answer</option>
                    {q.options.map((opt, oIndex) => (
                      <option key={oIndex} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2"
                onClick={addQuestion}
              >
                + Add Question
              </button>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSave}
                >
                  Tambahkan
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* add popup modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center py-10 justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Teacher ID</label>
              <input
                type="text"
                value={teacher_id}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <h3 className="text-lg font-semibold mt-4">Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-4 p-3 border rounded">
                <input
                  type="text"
                  value={q.question_text}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  placeholder="Enter question"
                  className="w-full px-3 py-2 border rounded mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  {q.option.map((opt, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        updateOption(qIndex, oIndex, e.target.value)
                      }
                      placeholder={`Option ${oIndex + 1}`}
                      className="px-3 py-2 border rounded"
                    />
                  ))}
                </div>
                <label className="block text-gray-700 mt-2">
                  Correct Answer
                </label>
                <select
                  value={q.correct_answer}
                  onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select correct answer</option>
                  {q.option.map((opt, oIndex) => (
                    <option key={oIndex} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              onClick={addQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
            >
              + Add Question
            </button>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveQuiz}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save Quiz
              </button>
              <button
                onClick={handleCloseAddPopup}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* add popup modal */}
      {/* {showModal && (
        <div className="fixed inset-0 flex items-center py-[50px] justify-center overflow-auto bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Quiz</h2>
            <form className="w-96">
              <div className="mb-4">
                {" "}
                <label className="block text-gray-700">
                  Teacher ID <i className="text-green-800">* (Auto Fill)</i>
                </label>
                <input
                  type="text"
                  name="teacher_id"
                  value={teacher_id}
                  onChange={handleNewQuizzesInputChange}
                  className="w-full px-3 py-2 border rounded"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newQuizzes.title}
                  onChange={handleNewQuizzesInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleAddQuizzes}
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
      )} */}
    </div>
  );
};

export default TableQuizzes;
