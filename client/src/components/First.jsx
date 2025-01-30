import { useNavigate } from "react-router-dom";

const First = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>INI HOME DARI PAGES</h1>
      <button
        onClick={() => navigate("/about")}
        className="bg-sky-400 rounded-md m-5 px-3 py-2 text-white"
      >
        About
      </button>
    </>
  );
};

export default First;
