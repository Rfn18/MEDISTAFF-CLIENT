import axios from "axios";
import { AuthCard } from "../../components/auth/AuthCardt";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  Mail,
  IdCard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getDeviceId } from "../../utils/getDeviceId";
import api from "../../services/api";

interface StandForm {
  id: number;
  kd_stand: string; 
  nama_stand: string;
  lokasi: string;
}

export const Register = () => {
  const [showPw1, setShowPw1] = useState<Boolean>(false);
  const [showPw2, setShowPw2] = useState<Boolean>(false);

  const [loading, setLoading] = useState<Boolean>(false);
  const [standList, setStandList] = useState<StandForm[]>([]);

  const url = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    nip: "",
    password: "",
    password_confirmation: "",
    device_id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setData({ ...data, device_id: getDeviceId() });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/register", data);

      localStorage.setItem("alert", "true");
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataStand = async () => {
      try {
        const response = await api.get(`/stand`);
        const data = response.data.data.datas.data;
        setStandList(data);
      } catch (error) {
        console.error("Failed fetching data.", error);
      }
    };

    fetchDataStand();
  }, []);

  return (
    <AuthCard>
      <div className="w-full flex flex-col items-center gap-2">
        <h1 className="text-xl font-semibold">Create New Account</h1>
        <p className="text-sm opacity-70">Join TehMallPos to get started</p>
      </div>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
          <label htmlFor="username" className="text-sm font-semibold">
            Username
          </label>
          <div className="flex items-center bg-background w-full h-12 mb-2 border border-[#ddd] rounded-xl">
            <User size="20" className="m-3 opacity-70" />
            <input
              type="text"
              name="name"
              placeholder="Enter Your Full Name"
              className="w-full h-full text-sm outline-none"
              onChange={handleChange}
            />
          </div>
          <label htmlFor="username" className="text-sm font-semibold">
            Email
          </label>
          <div className="flex items-center bg-background w-full h-12 mb-2 border border-[#ddd] rounded-xl">
            <Mail size="20" className="m-3 opacity-70" />
            <input
              type="text"
              name="email"
              placeholder="Enter Your Email"
              className="w-full h-full text-sm outline-none"
              onChange={handleChange}
            />
          </div>
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
              type={showPw1 ? "text" : "password"}
              name="password"
              placeholder="Create Your password"
              className="w-full h-full text-sm outline-none"
              onChange={handleChange}
            />
            {showPw1 ? (
              <EyeOff
                size="20"
                className="m-3 opacity-70 hover:opacity-100 cursor-pointer"
                onClick={() => setShowPw1(!showPw1)}
              />
            ) : (
              <Eye
                size="20"
                className="m-3 opacity-70 hover:opacity-100  cursor-pointer"
                onClick={() => setShowPw1(!showPw1)}
              />
            )}
          </div>
          <label
            htmlFor="password_confirmation"
            className="text-sm font-semibold"
          >
            Confirm Password
          </label>
          <div className="flex items-center bg-background w-full h-12 mb-2 border border-[#ddd] rounded-xl">
            <Lock size="20" className="m-3 opacity-70" />
            <input
              type={showPw2 ? "text" : "password"}
              name="password_confirmation"
              placeholder="Confirm Your password"
              className="w-full h-full text-sm outline-none"
              onChange={handleChange}
            />
            {showPw2 ? (
              <EyeOff
                size="20"
                className="m-3 opacity-70 hover:opacity-100 cursor-pointer"
                onClick={() => setShowPw2(!showPw2)}
              />
            ) : (
              <Eye
                size="20"
                className="m-3 opacity-70 hover:opacity-100  cursor-pointer"
                onClick={() => setShowPw2(!showPw2)}
              />
            )}
          </div>
          {loading ? (
            <button
              disabled={true}
              type="submit"
              className="flex items-center justify-center gap-2 w-full h-12 auth-gradient rounded-xl text-white font-semibold text-sm cursor-pointer opacity-70"
            >
              <LoaderCircle className="size-4 animate-spin" />
              Creating account...
            </button>
          ) : (
            <button
              type="submit"
              className="w-full h-12 auth-gradient rounded-xl text-white font-semibold text-sm cursor-pointer hover:opacity-70 transition"
            >
              Register
            </button>
          )}
        </form>
        <p className="mt-2 self-center text-sm opacity-70">
          Already have an account?{" "}
          <Link to={"/login"} className="font-bold">
            Login
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};
