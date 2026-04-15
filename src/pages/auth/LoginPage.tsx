import { Eye, EyeClosed, LoaderCircle, Lock, Mail } from "lucide-react";
import { AuthCard } from "../../components/auth/AuthCardt";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toastError, toastSuccess } from "../../lib/Toast";

export const Login = () => {
  const [showPw, setShowPw] = useState<boolean>(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/login", data);

      const result = response.data;
      const authData = result.data.datas;
      console.log(authData);

      localStorage.setItem("auth", JSON.stringify(authData));

      if (authData.user.role_id === 1) {
        navigate("/dashboard");
      } else if (authData.user.role_id === 2) {
        navigate("/admin/dashboard");
      } else if (authData.user.role_id === 3) {
        navigate("/staff/dashboard");
      }
    } catch (error: any) {
      setLoading(false);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          toastError("Email atau password salah");
        } else if (status === 422) {
          toastError("Validasi gagal");
        } else if (status === 500) {
          toastError("Server error, coba lagi nanti");
        } else {
          toastError("Terjadi kesalahan");
        }
      } else {
        toastError("Tidak bisa terhubung ke server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const indicatorAlert = localStorage.getItem("alert");

    if (indicatorAlert) {
      toastSuccess("Akun berhasil dibuat, silahkan login");

      setTimeout(() => {
        localStorage.removeItem("alert");
      }, 5000);
    }
  }, []);

  return (
    <AuthCard>
      <div className="w-full flex flex-col items-center gap-2">
        <h1 className="text-xl font-semibold">Login To Your Account</h1>
        <p className="text-sm opacity-70">Enter your credentials to continue</p>
      </div>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <div className="flex items-center bg-background w-full h-12 mb-2 border border-[#ddd] rounded-xl">
            <Mail size="20" className="m-3 opacity-70" />
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
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
