import Layout from "../../components/layouts/DashboardLayout";
import {
  MailQuestionMark,
  CircleCheck,
  CircleX,
  Box,
  ArrowDownUp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  LeaveAgreementTable,
} from "../../components/leaveRequest/UserRequest";
import { useEffect, useState } from "react";
import type { LeaveRequest } from "../../types/userType";
import api from "../../services/api";
import { CenterModal } from "../../components/ui/Modal";

const LeaveAgreementPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [leaveData, setLeaveData] = useState<LeaveRequest[]>([]);
  const [leaveForm, setLeaveForm] = useState<LeaveRequest | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const fetchLeaveData = async () => {
    try {
      const response = await api.get(`${baseUrl}/api/leave-requests`);
      const data = response?.data.data.datas.data;
      setLeaveData(data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const openDetailRequest = (row: LeaveRequest) => {
    setLeaveForm(row);
    setOpen(true);
  };

  console.log(leaveForm);
  const cardItem = [
    {
      id: 1,
      title: "Disetujui",
      amount: 20,
      icon: CircleCheck,
    },
    {
      id: 2,
      title: "Ditolak",
      amount: 10,
      icon: CircleX,
    },
    {
      id: 3,
      title: "Pending",
      amount: 100,
      icon: MailQuestionMark,
    },
  ];

  const COLOR_MAP = {
    1: {
      bg: "bg-success/10",
      text: "text-success",
    },
    2: {
      bg: "bg-destructive/10",
      text: "text-destructive",
    },
    3: {
      bg: "bg-warning/10",
      text: "text-warning",
    },
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return diffDays;
  };

  const handleAction = async (action: "approve" | "reject") => {
    if (!leaveForm) return;
    setIsProcessing(true);
    try {
      await api.put(`${baseUrl}/api/leave-requests/${leaveForm.id}/${action}`);
      setOpen(false);
      setLeaveForm(null);
      fetchLeaveData(); 
    } catch (error) {
      console.error(`Error ${action} leave request:`, error);
      alert(`Gagal memproses pengajuan cuti.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:auto-cols-max lg:grid-cols-3 gap-4 w-full">
        {cardItem.map((item) => {
          const Icon = item.icon;
          const color = COLOR_MAP[item.id as 1 | 2 | 3];

          return (
            <Card
              key={item.id}
              className="flex items-center gap-4 min-w-60 border-none py-6 px-0 pl-10 shadow-sm"
            >
              <CardHeader className="p-0">
                <div
                  className={`${color.bg} p-2 flex items-center justify-center w-12 h-12 rounded-xl`}
                >
                  <Icon className={color.text} />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <p className={`opacity-60 text-sm font-medium`}>{item.title}</p>
                <p className={`${color.text} text-3xl font-bold mt-1`}>
                  {item.amount}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-6">
        <Card className="gap-4 min-w-60 border border-border shadow-sm py-6 px-5 h-auto">
          <CardHeader className="flex-col md:flex-row justify-between items-start md:items-center border-none m-0 p-0 w-full gap-4">
            <p className="text-sm text-muted-foreground w-full">
              <span className="font-bold text-blue-dark text-base">{leaveData.length}</span> Pengajuan Ditemukan
            </p>
            <div className="w-full flex justify-start md:justify-end items-center">
              <div className="flex gap-3 w-full md:w-auto">
                <div className="flex w-fit items-center hidden md:flex">
                  <ArrowDownUp className="w-4 h-4 text-muted-foreground mr-2" />
                  <p className="text-sm text-muted-foreground whitespace-nowrap">Urutkan</p>
                </div>
                <input
                  type="date"
                  className="w-full md:w-40 px-3 py-2 border border-border rounded-lg text-sm focus:outline-blue-soft"
                />
                <select className="w-full md:w-40 px-3 py-2 border border-border rounded-lg text-sm focus:outline-blue-soft bg-white">
                  <option value="">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <div className="mt-6">
            {leaveData.length > 0 ? (
              <LeaveAgreementTable
                data={leaveData}
                onOpen={(row) => openDetailRequest(row)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-blue-primary/60" />
                </div>
                <p className="text-lg font-bold text-blue-dark">Belum ada permintaan cuti</p>
                <p className="text-sm text-muted-foreground mt-1">Saat ini tidak ada data pengajuan cuti yang perlu ditinjau.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <CenterModal
        title="Detail Pengajuan Cuti"
        open={open}
        onClose={() => {
          if (isProcessing) return;
          setOpen(false);
          setLeaveForm(null);
        }}
      >
        {leaveForm && (
          <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.3s_ease-out]">
            {/* Header Profile Section */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-6 border-b border-border/60">
              <img
                src={
                  leaveForm.employee?.photo
                    ? `${baseUrl}/storage/employee/${leaveForm.employee.photo}`
                    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(leaveForm.employee?.full_name || "User") + "&background=cce3de&color=03045e"
                }
                alt={leaveForm.employee?.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-center ring-4 ring-blue-50 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(leaveForm.employee?.full_name || "User") + "&background=cce3de&color=03045e";
                }}
              />
              <div className="flex-1">
                <h2 className="font-bold text-2xl text-blue-dark tracking-tight">
                  {leaveForm.employee?.full_name}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
                  <MailQuestionMark size={14} />
                  {leaveForm.employee?.email || "Tidak ada email"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="blue">{leaveForm.employee?.department?.department_name || "Departemen Tidak Diketahui"}</Badge>
                  <Badge variant="outline">{leaveForm.employee?.position?.position_name || "Posisi Tidak Diketahui"}</Badge>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="sm:self-start mt-2 sm:mt-0">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border
                  ${leaveForm.status?.toLowerCase() === 'approved' ? 'bg-success/10 text-success border-success/20' : 
                    leaveForm.status?.toLowerCase() === 'rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                    'bg-warning/10 text-warning border-warning/20'}`}
                >
                  {leaveForm.status || "PENDING"}
                </div>
              </div>
            </div>

            {/* Middle Details Section */}
            <div className="py-6 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div className="flex flex-col">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Jenis Cuti</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-primary">
                    <Box size={16} />
                  </div>
                  <p className="text-base font-bold text-blue-dark">
                    {leaveForm.leave_type?.leave_type_name || "Tahunan"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Durasi</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <CircleCheck size={16} />
                  </div>
                  <p className="text-base font-bold text-blue-dark">
                    {calculateDuration(leaveForm.start_date, leaveForm.end_date)} Hari
                  </p>
                </div>
              </div>

              <div className="flex flex-col col-span-2 md:col-span-1 border-t md:border-t-0 border-l-0 md:border-l pl-0 md:pl-4 border-border/60 pt-4 md:pt-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tanggal</p>
                <p className="text-sm font-bold text-blue-dark bg-slate-50 border border-border px-3 py-1.5 rounded-md inline-block w-fit">
                  {new Date(leaveForm.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} 
                  <span className="text-muted-foreground mx-2 font-normal">s/d</span> 
                  {new Date(leaveForm.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Bottom Reason Section */}
            <div className="pb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Alasan Cuti</p>
              <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl relative">
                <div className="absolute top-4 left-4 text-blue-primary/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21L16.411 14.5938C14.075 14.5938 12.35 12.8727 12.35 10.5975C12.35 8.28045 14.162 6.51866 16.536 6.51866C18.91 6.51866 21 8.36294 21 10.9765C21 14.4752 18.239 20.3547 14.017 21ZM3 21L5.394 14.5938C3.058 14.5938 1.333 12.8727 1.333 10.5975C1.333 8.28045 3.145 6.51866 5.519 6.51866C7.893 6.51866 9.983 8.36294 9.983 10.9765C9.983 14.4752 7.222 20.3547 3 21Z" />
                  </svg>
                </div>
                <p className="text-sm text-blue-dark leading-relaxed pl-8 relative z-10 italic">
                  "{leaveForm.reason || "Tidak ada alasan yang diberikan."}"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {leaveForm.status?.toLowerCase() === 'pending' && (
              <div className="flex gap-3 justify-end pt-4 border-t border-border/60">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAction("reject")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  <CircleX size={16} />
                  Tolak
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleAction("approve")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white bg-blue-primary hover:bg-blue-600 font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  <CircleCheck size={16} />
                  Terima Cuti
                </button>
              </div>
            )}
            
            {leaveForm.status?.toLowerCase() !== 'pending' && (
               <div className="flex justify-end pt-4 border-t border-border/60">
                 <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition-colors"
                 >
                   Tutup
                 </button>
               </div>
            )}
          </div>
        )}
      </CenterModal>
    </Layout>
  );
};

// Helper component for Badge
const Badge = ({ children, variant = "blue" }: { children: React.ReactNode, variant?: "blue" | "outline" }) => {
  if (variant === "outline") {
    return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold border border-border text-muted-foreground uppercase tracking-wider">{children}</span>;
  }
  return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-primary uppercase tracking-wider">{children}</span>;
};

export default LeaveAgreementPage;
