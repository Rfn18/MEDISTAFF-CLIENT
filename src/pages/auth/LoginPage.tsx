import { Eye, EyeClosed, IdCard, LoaderCircle, Lock, Mail } from "lucide-react";
import { AuthCard } from "../../components/auth/AuthCardt";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export const Login = () => {
  const [showPw, setShowPw] = useState<boolean>(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const bareer = localStorage.getItem("bareer_token");
  const user = localStorage.getItem("user");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("failed to fething data");
      }

      const result = await response.json();

      if (!bareer || !user) {
        localStorage.setItem("bareer_token", result.access_token);
        localStorage.setItem("user", result.user.role);
      } else {
        localStorage.removeItem("bareer_token");
        localStorage.removeItem("user");
        localStorage.setItem("bareer_token", result.access_token);
        localStorage.setItem("user", result.user.role);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorAlert(!errorAlert);
      setTimeout(() => {
        setErrorAlert(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const indicatorAlert = localStorage.getItem("alert");

    if (indicatorAlert) {
      setAlert(!alert);

      setTimeout(() => {
        localStorage.removeItem("alert");
        setAlert(false);
      }, 5000);
    }
  }, []);

  return (
    <AuthCard>
      {/* {alert && (
        <Toast
          message={
            <div className="flex items-center justify-center gap-4">
              <CircleCheck size={20} className="text-[#119184]" />
              <div className="text-[#119184]">
                <h2 className="text-sm font-bold">Creating account...</h2>
                <p className="text-sm">
                  Welcome to TehMallPos. Please login to continue
                </p>
              </div>
            </div>
          }
        />
      )}
      {errorAlert && (
        <Toast
          message={
            <div className="flex items-center justify-center gap-4">
              <CircleAlert size={20} className="text-[#FF4400]" />
              <div className="text-[#FF4400]">
                <h2 className="text-sm font-bold">Invalid Credentials</h2>
                <p className="text-sm">
                  Email atau password salah. Silahkan coba lagi
                </p>
              </div>
            </div>
          }
        />
      )} */}
      <div className="w-full flex flex-col items-center gap-2">
        <h1 className="text-xl font-semibold">Login To Your Account</h1>
        <p className="text-sm opacity-70">Enter your credentials to continue</p>
      </div>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
          <label htmlFor="nip" className="text-sm font-semibold">
            NIP
          </label>
          <div className="flex items-center bg-background w-full h-12 mb-2 border border-[#ddd] rounded-xl">
            <IdCard size="20" className="m-3 opacity-70" />
            <input
              type="number"
              name="nip"
              placeholder="Enter Your NIP"
              className="w-full h-full text-sm outline-none"
              onChange={handleChange}
            />
          </div>
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <div className="flex items-center bg-background w-full h-12 mb-2 border border-[#ddd] rounded-xl">
            <Lock size="20" className="m-3 opacity-70" />
            <input
              type={showPw ? "text" : "password"}
              name="password"
              minLength={8}
              placeholder="Enter Your password"
              className="w-full h-full text-sm outline-none"
              onChange={handleChange}
            />
            {showPw ? (
              <EyeClosed
                size="20"
                className="m-3 opacity-70 cursor-pointer"
                onClick={() => setShowPw(!showPw)}
              />
            ) : (
              <Eye
                size="20"
                className="m-3 opacity-70 cursor-pointer"
                onClick={() => setShowPw(!showPw)}
              />
            )}
          </div>
          {loading ? (
            <button
              disabled={true}
              type="submit"
              className="flex items-center justify-center gap-2  w-full h-12 auth-gradient rounded-xl text-white font-semibold text-sm cursor-pointer opacity-70"
            >
              <LoaderCircle className="size-4 animate-spin" />
              Loading...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full h-12 auth-gradient rounded-xl text-white font-semibold text-sm cursor-pointer hover:opacity-70 transition"
            >
              Login
            </button>
          )}
        </form>
        <p className="mt-2 self-center text-sm opacity-70">
          Don't have an account?{" "}
          <Link to={"/register"} className="font-bold">
            Register
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};
