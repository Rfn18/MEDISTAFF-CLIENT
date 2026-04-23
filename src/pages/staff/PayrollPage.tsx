import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BanknoteX,
  CalendarClock,
  CircleDollarSign,
  Loader2,
  X,
} from "lucide-react";
import Layout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Card, CardContent } from "../../components/ui/card";
import { CenterModal } from "../../components/ui/Modal";
import type { Payroll } from "../../types/userType";
import { Loading } from "../../components/ui/load";
import type { Payslip } from "../../types/payrollType";

const MONTH_OPTIONS = [
  { id: 1, label: "Januari" },
  { id: 2, label: "Februari" },
  { id: 3, label: "Maret" },
  { id: 4, label: "April" },
  { id: 5, label: "Mei" },
  { id: 6, label: "Juni" },
  { id: 7, label: "Juli" },
  { id: 8, label: "Agustus" },
  { id: 9, label: "September" },
  { id: 10, label: "Oktober" },
  { id: 11, label: "November" },
  { id: 12, label: "Desember" },
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const yearOptions = Array.from(new Array(5), (_, i) => currentYear - 2 + i);

type PayrollDetail = Payroll & {
  allowance?: number;
  deduction?: number;
  overtime_pay?: number;
  total_salary?: number;
};

export default function StaffPayrollPage() {
  const { user } = useAuth();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [payroll, setPayroll] = useState<PayrollDetail | null>(null);
  const [payslip, setPayslip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPayslip, setLoadingPayslip] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const userName = user?.employee?.full_name || user?.name || "Staff";

  const fetchPayroll = async () => {
    if (!user?.employee_id) return;
    try {
      setLoading(true);
      const response = await api.post("/payroll-by-period", { month, year });
      const payrollData = response?.data?.data?.datas?.data || [];
      const myPayroll = payrollData.find(
        (item: PayrollDetail) => Number(item.employee_id) === user.employee_id,
      );

      setPayroll(myPayroll || null);
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
      setPayroll(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayslip = async () => {
    if (!user?.employee_id) return;
    try {
      setLoadingPayslip(true);
      const response = await api.post("/payslip-by-payroll-id", {
        payroll_id: payroll?.id,
      });

      setPayslip(response?.data.data.datas);
    } catch (error) {
      console.error("Failed to fetch payslip data:", error);
    } finally {
      setLoadingPayslip(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [month, year, user?.employee_id]);

  useEffect(() => {
    fetchPayslip();
  }, [payroll?.id]);

  const isPaid = useMemo(() => !!payroll, [payroll]);
  const grossSalary =
    Number(payroll?.base_salary || 0) +
    Number(payroll?.allowance || 0) +
    Number(payroll?.overtime_pay || 0);

  return (
    <Layout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-2 lg:px-4 bg-[#F8FAFC] pb-12 animate-[fadeIn_0.3s_ease-out]">
        <div className="mt-4 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-dark flex items-center gap-2">
              <CircleDollarSign size={24} className="text-blue-dark" />
              Status Gaji Saya
            </h1>
            <p className="text-dark/60 mt-2 text-sm">
              Halo {userName}, pantau status gaji dan lihat rincian pendapatan
              bulanan Anda.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              className="block w-full md:w-[160px] min-h-[44px] rounded-lg border border-border bg-white px-3 text-sm text-blue-dark focus-within:outline-blue-soft/20 focus-within:outline-3"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <select
              className="block w-full md:w-[120px] min-h-[44px] rounded-lg border border-border bg-white px-3 text-sm text-blue-dark focus-within:outline-blue-soft/20 focus-within:outline-3"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Card className="border border-border shadow-sm">
          <CardContent className="p-6">
            {loading ? (
              <div className="py-14">
                <Loading message="Memuat data gaji..." />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPaid ? "bg-emerald-100" : "bg-orange-100"
                    }`}
                  >
                    {isPaid ? (
                      <BadgeCheck className="text-emerald-600" />
                    ) : (
                      <BanknoteX className="text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-dark/60">Status Penggajian</p>
                    <h2 className="text-xl font-bold text-blue-dark mt-1">
                      {isPaid ? "Sudah Digaji" : "Belum Digaji"}
                    </h2>
                    <p className="text-dark/60 text-sm mt-1">
                      Periode {MONTH_OPTIONS[month - 1].label} {year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isPaid ? (
                    <button
                      onClick={() => setOpenDetail(true)}
                      className="min-h-[44px] px-5 rounded-lg bg-blue-dark text-white text-sm font-semibold cursor-pointer hover:bg-blue-dark/90 transition"
                    >
                      {loadingPayslip ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        "Lihat Rincian Gaji"
                      )}
                    </button>
                  ) : (
                    <div className="rounded-lg bg-orange-50 text-orange-700 px-4 py-2 text-sm font-medium border border-orange-200">
                      Menunggu proses payroll dari admin
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CenterModal
        title="Rincian Gaji"
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      >
        <div className="w-full max-w-2xl mx-auto animate-[fadeIn_0.2s_ease-out]">
          <div className="pb-5 border-b border-border/70">
            <h2 className="text-2xl font-bold text-blue-dark">Slip Gaji</h2>
            <p className="text-sm text-dark/60 mt-1 flex items-center gap-2">
              <CalendarClock size={14} />
              Periode {MONTH_OPTIONS[month - 1].label} {year}
            </p>
          </div>
          <div className="relative mt-5 h-[600px] w-full overflow-hidden">
            <iframe
              src={`http://localhost:8000/payslip/${payslip?.file_path}#toolbar=0`}
              className="w-full h-full rounded-lg pointer-events-none overflow-hidden"
            />

            <a
              href={`http://localhost:8000/payslip/${payslip?.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
            />
          </div>
          <div className="pt-5 border-t border-border/70 mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => setOpenDetail(false)}
              className="px-5 min-h-[42px] rounded-lg border border-red-500 text-red-500 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer flex items-center gap-2 hover:text-red-600"
            >
              <X size={16} />
              Tutup
            </button>
          </div>
        </div>
      </CenterModal>
    </Layout>
  );
}
