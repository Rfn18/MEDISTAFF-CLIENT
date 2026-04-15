import { useEffect, useState } from "react";
import Layout from "../../../components/layouts/DashboardLayout";
import { Html5Qrcode } from "html5-qrcode";
import { Building2, CheckCircle2Icon, SwitchCamera } from "lucide-react";
import api from "../../../services/api";
import { Loading } from "../../../components/ui/load";
import type { User } from "../../../types/userType";
import type { LocationRecord, QrToken } from "../../../types/attendanceType";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Card } from "../../../components/ui/card";
import { toastError } from "../../../lib/Toast";

const ScanPage = () => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [user, setUser] = useState<User[]>([]);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("user");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<{
    name: string;
    time: string;
  }>({ name: "", time: "" });
  const [isCheckIn, setIsCheckIn] = useState<boolean>(true);
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);

  const time = new Date().toISOString();

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/user/shift-schedule/today`);
      const data = response.data.data.datas.data || response.data.data.datas;
      setUser(data);
    } catch (error) {
      console.error("error fetching employee", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    setLoadingList(true);
    try {
      const res = await api.get("/attendance-settings");
      const raw =
        res?.data?.data?.datas?.data ??
        res?.data?.data?.datas ??
        res?.data?.data ??
        res?.data ??
        [];
      setLocations(Array.isArray(raw) ? raw : [raw]);
    } catch {
      setLocations([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const hasLoation = locations.length > 0;

  useEffect(() => {
    const element = document.getElementById("reader");
    if (element) {
      const html5qrcode = new Html5Qrcode("reader");
      fetchEmployee();
      setScanner(html5qrcode);

      return () => {
        if (html5qrcode.isScanning) {
          html5qrcode.stop().catch((err) => console.error("Stop failed", err));
        }
      };
    }
  }, [hasLoation]);

  const startScan = async () => {
    if (!scanner) return;
    setIsScanning(true);

    try {
      await scanner.start(
        { facingMode: cameraMode },
        {
          fps: 20,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            return {
              width: viewfinderWidth * 0.7,
              height: viewfinderHeight * 0.7,
            };
          },
        },
        (decodedText) => {
          handleAttendance(JSON.parse(decodedText));
          scanner.stop();
          setIsScanning(false);
        },
        (errorMessage) => {},
      );
    } catch (error) {
      console.error("error scanning", error);
      setIsScanning(false);
    }
  };

  const handleAttendance = async (decodedText: QrToken) => {
    const data = decodedText;
    try {
      setLoading(true);
      if (isCheckIn) {
        await api.post(`/check-in`, data);
      } else {
        await api.post(`/check-out`, data);
      }
      setSuccessAlert(true);
      setSuccessMessage({
        name: user.find((item) => item.id === data.user_id)?.name!,
        time: time,
      });
    } catch (error: any) {
      toastError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successAlert) {
      const timer = setTimeout(() => {
        setSuccessAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successAlert]);

  if (!hasLoation) {
    return (
      <Layout>
        <Card className="border-none mt-4">
          <div className="flex flex-col items-center justify-center p-16 text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
              <Building2 size={32} className="text-blue-dark/60" />
            </div>
            <h3 className="text-lg font-bold text-blue-dark">
              Belum ada lokasi rumah sakit
            </h3>
            <p className="text-blue-dark/60 mt-1 max-w-sm text-sm">
              Silahkan tambahkan lokasi rumah sakit terlebih dahulu
            </p>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      {successAlert && (
        <Alert className="fixed bottom-0 right-0 m-4 shadow border-none text-success w-80 animate-[slideIn_.6s_ease-in-out]">
          <CheckCircle2Icon className="text-success" />
          <AlertTitle>Berhasil Absen!</AlertTitle>
          <AlertDescription className="text-success/60 text-xs">
            Nama :{" "}
            <span className="font-bold text-success">
              {successMessage.name}
            </span>
            <br />
            Jam :{" "}
            <span className="font-bold text-success">
              {successMessage.time}
            </span>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-blue-dark">
          Absensi Karyawan
        </h2>

        <div className="relative w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <button
                onClick={startScan}
                className="bg-primary z-10 text-white px-8 py-3 rounded-full font-semibold transition hover:cursor-pointer hover:scale-105"
              >
                Mulai Absen
              </button>
            </div>
          )}

          <div className="relative w-full h-full overflow-hidden rounded-3xl">
            <div id="reader"  className="w-full h-full"></div>
            {isScanning && (
              <>
                <div className="absolute  inset-0 border-[40px] border-black/30 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-scan-loop"></div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4 max-w-md">
          {loading ? (
            <Loading message="Melakukan absensi..." />
          ) : (
            <>
              <div className="text-sm text-blue-dark italic text-right">
                Pastikan device yang anda gunakan sama dengan pertama kali
                mendaftar!
              </div>
              <button
                onClick={() => setIsCheckIn(!isCheckIn)}
                className="border-blue border-2 w-full text-blue-dark px-8 py-2 text-sm font-bold rounded-full transition hover:cursor-pointer hover:bg-blue-dark hover:text-white"
              >
                {isCheckIn ? "Check In" : "Check Out"}
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;
