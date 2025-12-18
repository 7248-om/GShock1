import { useNavigate } from "react-router-dom";
import { useAuthMock } from "../hooks/useAuthMock";


const Login = () => {
  const { login } = useAuthMock();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-6">Login Required</h1>
      <button
        onClick={() => {
          login();
          navigate("/payment");
        }}
        className="px-6 py-3 bg-black text-white uppercase tracking-widest"
      >
        Simulate Login
      </button>
    </div>
  );
};

export default Login;
