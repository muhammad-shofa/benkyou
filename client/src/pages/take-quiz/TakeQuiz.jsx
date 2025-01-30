import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const TakeQuiz = () => {
  const { quiz_id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/quiz/${quiz_id}`
        );
        const data = await response.json();
        console.log("Data Quiz pada frontend : ", data);
        console.log("Data.quiz Quiz pada frontend : ", data.quiz);
        setQuiz(data.quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [quiz_id]);

  const handleAnswer = () => {
    if (
      selectedOption === quiz.questions[currentQuestionIndex].correct_answer
    ) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleQuitFromQuiz = () => {
    navigate("/class-dashboard");
  };

  if (!quiz) return <p>Loading quiz...</p>;
  if (isFinished)
    return (
      <div>
        <Navbar />
        <div className="p-[10px]">
          <div className="w-100 min-h-[80vh] p-2 bg-gray-300 rounded flex justify-center items-center">
            <div className="w-[400px] m-auto bg-gray-200 p-5 rounded">
              <div className="flex justify-center items-center my-auto">
                <button
                  className="p-2 m-4 bg-yellow-500 rounded"
                  onClick={() => handleQuitFromQuiz()}
                >
                  <i
                    className="fa-solid fa-door-open mx-1"
                    style={{ color: "#ffffff" }}
                  ></i>
                  Quit
                </button>
                <h1 className="text-3xl font-bold text-center">
                  Your score: {score}/{quiz.questions.length}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="p-[10px]">
        <div className="w-100 min-h-[80vh] p-2 bg-gray-300 rounded flex justify-center items-center">
          <div className="w-[400px] m-auto bg-gray-200 p-5 rounded">
            <h1 className="text-3xl font-bold my-3">{quiz.title}</h1>
            <h3 className="text-xl">
              Question {currentQuestionIndex + 1}:{" "}
              {quiz.questions[currentQuestionIndex].question_text}
            </h3>
            <ul>
              {quiz.questions[currentQuestionIndex].option.map((opt, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={opt}
                      className="mr-2 border-2 border-gray-500"
                      checked={selectedOption === opt}
                      onChange={() => setSelectedOption(opt)}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAnswer}
              disabled={!selectedOption}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
            >
              {currentQuestionIndex + 1 < quiz.questions.length
                ? "Next"
                : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
