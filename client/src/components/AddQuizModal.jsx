/* eslint-disable react/prop-types */
import { useState } from "react";

const AddQuizModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const teacher_id = localStorage.getItem("id");

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

  // Menyimpan quiz
  const handleSave = () => {
    const newQuiz = {
      teacher_id: teacher_id,
      title,
      questions,
      created_at: new Date().toISOString(),
    };
    onSave(newQuiz);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Quiz</h2>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
        />

        <h3>Questions</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-container">
            <input
              type="text"
              value={q.question_text}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              placeholder="Enter question"
            />
            <div className="options">
              {q.option.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                />
              ))}
            </div>
            <label>Correct Answer:</label>
            <select
              value={q.correct_answer}
              onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
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
        <button onClick={addQuestion}>+ Add Question</button>
        <button onClick={handleSave}>Save Quiz</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddQuizModal;
