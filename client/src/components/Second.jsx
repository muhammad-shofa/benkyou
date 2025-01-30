import { useNavigate } from "react-router-dom";

const Second = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>INI ABOUT DARI PAGES</h1>
      <button
        onClick={() => navigate("/")}
        className="bg-sky-400 rounded-md m-5 px-3 py-2 text-white"
      >
        Home
      </button>
    </>
  );
};

export default Second;
