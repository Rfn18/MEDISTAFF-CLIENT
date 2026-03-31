import { useEffect, useState } from "react";
import Layout from "../../../components/layouts/DashboardLayout";
import { Html5Qrcode } from "html5-qrcode";
import {  SwitchCamera } from "lucide-react";
import api from "../../../services/api";
import { Loading } from "../../../components/ui/load";
import type { Employee } from "../../../types/userType";
import type { QrToken } from "../../../types/attendanceType";

const ScanPage = () => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("user");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<{name: string, time: string}>({"name": "", "time": ""});

  const time = new Date().toISOString();

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/employees`);
      const data = response.data.data.datas.data;
      setEmployee(data);
    } catch (error) {
      console.error("error fetching employee", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const html5qrcode = new Html5Qrcode("reader");
    fetchEmployee();
    setScanner(html5qrcode);

    return () => {
      if (html5qrcode.isScanning) {
        html5qrcode.stop();
      }
    };
  }, []);

  const switchCamera = () => {
    setCameraMode((prev) => (prev === "environment" ? "user" : "environment"));
    scanner?.stop().then(() => startScan());
  };

  const startScan = async () => {
    if (!scanner) return;
    setIsScanning(true);

    try {
      await scanner.start(
        { facingMode: cameraMode },
        {
          fps: 10,
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
    console.log(data)
    try {
      setLoading(true);
      await api.post(`/check-in`, data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setSuccessAlert(true);
      setSuccessMessage({name: employee.find((item) => item.id === data.employee_id)?.full_name!, time: time});
      setLoading(false);
    }
  };


  return (
    <Layout>
      <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-blue-dark">
          Absensi Karyawan
        </h2>
        
        <div className="relative w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <div id="reader" className="w-full h-full"></div>

          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <button
                onClick={startScan}
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold transition hover:cursor-pointer hover:scale-105"
              >
                Mulai Absen
              </button>
            </div>
          )}

          <div className="relative w-72 h-72 overflow-hidden rounded-3xl">
            <div id="reader"></div>
            isScanning && (
            <>
              <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-scan-loop"></div>
            </>
            )
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4 max-w-md">
          {loading ? (
            <Loading message="Melakukan absensi..." />
          ) : (
            <>
              <div className="text-sm text-blue-dark italic text-left">
                <p>Berhasil login!</p>
                <p>Nama : {successMessage.name}</p>
                <p>Jam : {successMessage.time}</p>
              </div>
              <button
                onClick={switchCamera}
                className="border-blue border-2 text-blue-dark px-8 py-2 text-sm font-bold rounded-full transition hover:cursor-pointer hover:bg-blue-dark hover:text-white"
              >
                <SwitchCamera />
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;
