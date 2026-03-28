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

const QRCodePage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [qrToken, setQrToken] = useState<string>("");
  const [countdownTimer, setCountdownTimer] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const fetchQrCode = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${baseUrl}/api/dinamic-qr`);
      const data = response.data;
      setQrToken(data.qr_payload);
    } catch (error) {
      console.error("fetching qr code error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCode();
    const timer = setInterval(() => {
      fetchQrCode();
    }, 30000);
    const countdownTimer = setInterval(() => {
      setCountdownTimer((prev) => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdownTimer);
    };
  }, []);

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
          // Berikan pesan yang jelas jika GPS dimatikan
          let msg = "Gagal mengambil lokasi.";
          if (error.code === 1)
            msg = "Mohon izinkan akses lokasi di pengaturan browser Anda.";
          reject(new Error(msg));
        },
        {
          enableHighAccuracy: true, // WAJIB: Agar menggunakan GPS, bukan hanya koneksi internet
          timeout: 10000, // Menunggu maksimal 10 detik
          maximumAge: 0, // Jangan gunakan lokasi lama yang tersimpan di cache
        },
      );
    });
  };

  useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        setLocation(loc);
        console.log("Lokasi berhasil didapatkan:", loc);
      })
      .catch((err) => {
        console.error("Gagal mendapatkan lokasi:", err.message);
      });
  }, []);
  console.log(location);

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
            {loading ? (
              <Loading message="Memuat QR Code..." />
            ) : (
              <div className="bg-white p-5 rounded-xl inline-block animate-[floatUp_0.3s_ease-out]">
                <QRCodeCanvas value={qrToken} size={300} level={"H"} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="mt-4 text-blue-dark">
            QR Code akan diperbarui dalam <b>{countdownTimer} detik</b>.
          </p>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default QRCodePage;
