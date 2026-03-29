import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/layouts/DashboardLayout";
import api from "../../../services/api";
import type { Employee } from "../../../types/userType";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  BadgeCheck,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Loading } from "../../../components/ui/load";

export default function EmployeeProfileAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;
        const response = await api.get(`/employees/${id}`);
        const data = response.data.data.datas;
        if (data) {
          setEmployee(data);
        } else {
          setError("Gagal memuat profil karyawan.");
        }
      } catch (err) {
        console.error("Error fetching employee profile", err);
        setError("Terjadi kesalahan saat mengambil data profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, baseUrl]);

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
            Gagal Memuat Profil Karyawan
          </h2>
          <p className="text-muted-foreground mt-2 mb-6">{error}</p>
          <button
            onClick={() => navigate("/admin/management")}
            className="bg-blue-primary text-white font-semibold px-6 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity"
          >
            Kembali
          </button>
        </div>
      </Layout>
    );

  const employeeName = employee.full_name || "Unknown";
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
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">
        {/* Navigation / Actions Head */}
        <div className="flex justify-between items-center w-full mt-2">
          <button
            onClick={() => navigate("/admin/management")}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-blue-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-white"
          >
            <ArrowLeft size={16} /> Kembali ke Daftar Karyawan
          </button>
          <div className="flex gap-3">
            <button className="bg-white border border-border hover:border-blue-primary text-blue-dark shadow-sm font-semibold px-4 py-2 rounded-lg text-sm transition-all focus:outline-none">
              Edit Data
            </button>
          </div>
        </div>

        {/* Banner & Header Section */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm relative pt-14">
          {/* Abstract Header BG instead of solid gradient */}
          <div className="absolute top-0 w-full h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-blue-50 opacity-90 z-0"></div>

          <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row gap-6 items-center md:items-end -mt-10 relative z-10 border-t border-white/40 backdrop-blur-sm">
            <div className="relative p-1.5 bg-white rounded-full shadow-lg shrink-0">
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
              <div
                className="absolute bottom-2 right-2 bg-success text-white p-1.5 rounded-full border-2 border-white shadow-sm"
                title={employee.employee_status}
              >
                <BadgeCheck size={16} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-bold text-blue-dark tracking-tight">
                {employee.full_name}
              </h1>
              <p className="text-blue-primary font-semibold text-lg max-w-xl">
                {employee.position?.position_name || "Staff"}
              </p>
            </div>

            <div className="shrink-0 mb-4 bg-white/50 backdrop-blur px-5 py-2.5 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-primary/10 flex items-center justify-center">
                <Building2 className="text-blue-primary" size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Departemen
                </p>
                <p className="text-blue-dark font-bold text-base">
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
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-5 pb-2 border-b border-border/60">
                Informasi Kontak
              </h3>
              <div className="space-y-5">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <Mail size={14} className="text-blue-400" /> Email
                  </p>
                  <p className="text-sm font-semibold text-blue-dark break-all">
                    {employee.email || "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <Phone size={14} className="text-green-500" /> No. Handphone
                  </p>
                  <p className="text-sm font-semibold text-blue-dark">
                    {employee.phone_number || "-"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <MapPin size={14} className="text-orange-400" /> Alamat
                  </p>
                  <p className="text-sm font-semibold text-blue-dark leading-relaxed">
                    {employee.address || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-sm uppercase tracking-wider font-bold text-muted-foreground mb-4 pb-2 border-b border-border/60">
                Biodata Pribadi
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">
                    Tempat Lahir
                  </span>
                  <span className="text-sm font-semibold text-blue-dark">
                    {employee.birth_place || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">
                    Jenis Kelamin
                  </span>
                  <span className="text-sm font-semibold text-blue-dark">
                    {employee.gender === "L"
                      ? "Laki-Laki"
                      : employee.gender === "P"
                        ? "Perempuan"
                        : employee.gender || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Kepegawaian */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm h-full">
              <h3 className="text-xl font-bold text-blue-dark mb-8 border-b border-border/80 pb-3 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase size={20} className="text-blue-primary" />
                </div>{" "}
                Data Administratif
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Tanggal Bergabung
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-border/60 flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-blue-primary/70" />
                    </div>
                    <span className="text-lg font-bold text-blue-dark">
                      {formatDate(employee.hire_date)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Status Karyawan
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                      <span className="w-3 h-3 rounded-full bg-success animate-pulse"></span>
                    </div>
                    <span className="text-lg font-bold text-blue-dark">
                      {employee.employee_status || "Aktif"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col col-span-1 sm:col-span-2 pt-6 border-t border-border/40 w-full mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <div className="bg-slate-50 p-4 rounded-xl border border-border flex flex-col gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <User size={14} /> Nomor Induk Pegawai (NIP)
                      </span>
                      <span className="text-2xl font-bold font-mono text-blue-dark tracking-tight">
                        {employee.nip || "-"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-border flex flex-col gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <User size={14} /> Nomor Induk Kependudukan (NIK)
                      </span>
                      <span className="text-xl font-bold font-mono text-blue-dark tracking-tight">
                        {employee.nik || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
