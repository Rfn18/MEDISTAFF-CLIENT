import { useEffect, useState } from "react";
import Layout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import type { Employee } from "../../types/userType";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  BadgeCheck,
  Clock,
  ShieldCheck,
  BadgeAlert,
} from "lucide-react";
import { Loading } from "../../components/ui/load";

export default function ProfilePage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.employee_id) {
          setError(`ID Pegawai tidak ditemukan`);
          return;
        }

        const response = await api.get(`/employees/${user.employee_id}`);
        const data = response.data.data.datas;
        if (data) {
          setEmployee(data);
        } else {
          setError("Gagal memuat profil.");
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, baseUrl]);

  if (loading)
    return (
      <Layout>
        <Loading message="Memuat Profil..." />
      </Layout>
    );
  if (error || !employee)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-border mt-6">
          <ShieldCheck size={48} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-blue-dark">
            Gagal Memuat Profil
          </h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      </Layout>
    );

  const employeeName = employee.full_name || "User";
  const userPhoto = employee.photo
    ? `${baseUrl}/storage/employee/${employee.photo}`
    : "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(employeeName) +
      "&background=cce3de&color=03045e";

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto animate-[fadeIn_0.4s_ease-out]">
        {/* Banner & Header Section */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs relative">
          <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row gap-6 items-center md:items-end relative z-10">
            <div className="relative p-1.5 bg-white rounded-full shadow-md shrink-0">
              <img
                src={userPhoto}
                alt={employeeName}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(employeeName) +
                    "&background=cce3de&color=03045e";
                }}
              />
              {
                employee.employee_status === "active" ? (
                  <div
                    className="absolute bottom-2 right-2 bg-success text-white p-1.5 rounded-full border-2 border-white shadow-sm"
                    title="Active"
                  >
                    <BadgeCheck size={16} />
                  </div>
                ) : (
                  <div
                    className="absolute bottom-2 right-2 bg-danger text-white p-1.5 rounded-full border-2 border-white shadow-sm"
                    title="Inactive"
                  >
                    <BadgeAlert size={16} />
                  </div>
                )
              }
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-bold text-blue-dark tracking-tight">
                {employee.full_name}
              </h1>
              <p className="text-blue-primary font-semibold text-lg max-w-xl line-clamp-1">
                {employee.position?.position_name || "Staff"}
              </p>
            </div>

            <div className="shrink-0 mb-4 bg-blue-50/80 px-5 py-2.5 rounded-xl border border-blue-100 flex items-center gap-3">
              <Building2 className="text-blue-primary" size={24} />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Departemen
                </p>
                <p className="text-blue-dark font-bold">
                  {employee.department?.department_name || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Kontak & Personal */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
              <h3 className="text-lg font-bold text-blue-dark mb-4 pb-2 border-b border-border/60">
                Informasi Kontak
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-primary shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-blue-dark break-all">
                      {employee.email || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      No. Handphone
                    </p>
                    <p className="text-sm font-semibold text-blue-dark">
                      {employee.phone_number || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-500 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Alamat
                    </p>
                    <p className="text-sm font-semibold text-blue-dark leading-relaxed">
                      {employee.address || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Kepegawaian */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs">
              <h3 className="text-lg font-bold text-blue-dark mb-6 border-b border-border/60 pb-2 flex items-center gap-2">
                <Briefcase size={20} className="text-blue-primary" /> Data
                Kepegawaian
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Status Karyawan
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                    <span className="text-base font-bold text-blue-dark">
                      {employee.employee_status || "Aktif"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Tanggal Bergabung
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={18} className="text-blue-primary/70" />
                    <span className="text-base font-bold text-blue-dark">
                      {formatDate(employee.hire_date)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Nomor Induk Pegawai (NIP)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={18} className="text-blue-primary/70" />
                    <span className="text-base font-bold font-mono text-blue-dark tracking-wide bg-slate-50 px-3 py-1 rounded border border-border/50">
                      {employee.nip || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={18} className="text-blue-primary/70" />
                    <span className="text-base font-bold font-mono text-blue-dark tracking-wide bg-slate-50 px-3 py-1 rounded border border-border/50">
                      {employee.nik || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col py-2 border-b border-border/40">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Tempat Lahir
                  </span>
                  <span className="text-sm font-semibold text-blue-dark gap-2 mt-1">
                    {employee.birth_place || "-"}
                  </span>
                </div>
                <div className="flex flex-col py-2 border-b border-border/40">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Jenis Kelamin
                  </span>
                  <span className="text-sm font-semibold text-blue-dark gap-2 mt-1">
                    {employee.gender === "male"
                      ? "Laki-Laki"
                      : employee.gender === "female"
                        ? "Perempuan"
                        : employee.gender || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
