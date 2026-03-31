import { ClockCheck } from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { Loading } from "../../../components/ui/load";
import type { QrToken } from "../../../types/attendanceType";
import { useAuth } from "../../../context/AuthContext";

const QRCodePage = () => {
  const [qrToken, setQrToken] = useState<QrToken>({qr_payload: "", device_id: "", longitude: 0, latitude: 0, user_id: 0});
  const [countdownTimer, setCountdownTimer] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const [isQrCode, setIsQrCode] = useState<boolean>(false);
  const device_id = localStorage.getItem("device_id");
  const {user} = useAuth()

  const fetchQrCode = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dinamic-qr`);
      const data = response.data;
      setQrToken({...qrToken, qr_payload: data.qr_payload, device_id: device_id!, user_id: user?.id!});
    } catch (error) {
      console.error("fetching qr code error", error);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = async() => {
    setIsQrCode(true);
    await fetchQrCode();
    const countdownTimer = setInterval(() => {
      setCountdownTimer((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }

  useEffect(() => {
    if(countdownTimer === 0) {
      setIsQrCode(false);
    }
  }, [countdownTimer]);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Browser Anda tidak mendukung GPS"));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let msg = "Gagal mengambil lokasi.";
          if (error.code === 1)
            msg = "Mohon izinkan akses lokasi di pengaturan browser Anda.";
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0, 
        },
      );
    });
  };

  useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        setLocation(loc);
      })
      .catch((err) => {
        console.error("Gagal mendapatkan lokasi:", err.message);
      });
  }, []);

  useEffect(() => {
    if (location) {
      setQrToken({...qrToken, longitude: location.lng, latitude: location.lat})
    }
  }, [location]);

  console.log(qrToken.qr_payload)

  return (
    <Layout>
      <Card className="border-none mt-6 h-auto shadow-sm">
        <CardHeader className="bg-slate-50/50 rounded-t-xl border-b border-border/80">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="font-bold text-xl flex items-center gap-2">
                <ClockCheck size={24} />
                QR Code Absensi
              </h1>
              <p className="opacity-60 text-sm mt-1">
                Scan Qr Code dibawah dengan scanner yang disediakan oleh petugas
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full py-16">
            {!isQrCode && (
              <button onClick={startCountdown} className="bg-primary text-white px-8 py-2 rounded-full font-semibold transition hover:cursor-pointer hover:bg-blue-dark hover:text-white">Generate QR Code</button>
            )}
            
            {loading ? (
              <Loading message="Memuat QR Code..." />
            ) : (
              isQrCode && (
                <div className="bg-white p-5 rounded-xl inline-block animate-[floatUp_0.3s_ease-out]">
                  <QRCodeCanvas value={JSON.stringify(qrToken)} size={300} level={"L"} />
                </div>
              )
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="mt-4 text-blue-dark">
          {isQrCode && !loading && (
            <p>QR Code akan diperbarui dalam <b>{countdownTimer} detik</b>.</p>
          )}
          </p>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default QRCodePage;
