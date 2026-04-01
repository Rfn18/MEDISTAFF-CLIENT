import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BanknoteX,
  CircleDollarSign,
  Plus,
  CheckCircle2Icon,
} from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import api from "../../../services/api";
import type { Employee, Payroll, Position } from "../../../types/userType";
import { Loading } from "../../../components/ui/load";
import { toRupiah } from "../../../utils/toRupiah";
import type { Allowance, Deduction } from "../../../types/payrollType";
import { Card } from "../../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function PayrollPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [position, setPosition] = useState<Position[]>([]);
  const [allowance, setAllowance] = useState<Allowance[]>([]);
  const [deduction, setDeduction] = useState<Deduction[]>([]);

  const [selectedAllowances, setSelectedAllowances] = useState<number[]>([]);
  const [selectedDeductions, setSelectedDeductions] = useState<number[]>([]);
  const [isAllowanceCustom, setIsAllowanceCustom] = useState<boolean>(false);
  const [customAllowance, setCustomAllowance] = useState<{
    name: string;
    amount: number;
  }>({
    name: "",
    amount: 0,
  });
  const [isDeductionCustom, setIsDeductionCustom] = useState<boolean>(false);
  const [customDeduction, setCustomDeduction] = useState<{
    name: string;
    amount: number;
  }>({
    name: "",
    amount: 0,
  });
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingEmp, setProcessingEmp] = useState<Employee | null>(null);
  const [baseSalaryInput, setBaseSalaryInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const yearOptions = Array.from(
    new Array(5),
    (_, i) => currentDate.getFullYear() - 2 + i,
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const empRes = await api.get("/employees");
      const activeEmployees = empRes?.data?.data?.datas?.data || [];
      setEmployees(
        activeEmployees.filter(
          (e: Employee) =>
            e.employee_status === "active" || e.employee_status === "inactive",
        ),
      );

      const payRes = await api.post("/payroll-by-period", {
        month: selectedMonth,
        year: selectedYear,
      });

      setPayrolls(payRes.data.data.datas.data || []);
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosition = async () => {
    try {
      const res = await api.get("/positions");
      const data = res.data.data.datas.data;
      setPosition(data);
    } catch (error) {
      console.error("Failed to fetch position data:", error);
    }
  };

  const fetchAllowance = async () => {
    try {
      const res = await api.get("/allowances");
      const data = res.data.data.datas.data;
      setAllowance(data);
    } catch (error) {
      console.error("Failed to fetch allowance data:", error);
    } 
  };

  const fetchDeduction = async () => {
    try {
      const res = await api.get("/deductions");
      const data = res.data.data.datas.data;
      setDeduction(data);
    } catch (error) {
      console.error("Failed to fetch deduction data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPosition();
    fetchAllowance();
    fetchDeduction();
  }, [selectedMonth, selectedYear]);

  const handleOpenModal = (emp: Employee) => {
    setProcessingEmp(emp);
    setBaseSalaryInput("");
    setIsModalOpen(true);
  };

  const handleProcessPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingEmp) return;

    setIsSubmitting(true);
    try {
      const payload: Record<string, any> = {
        employee_id: processingEmp.id,
        month: selectedMonth,
        year: selectedYear,
        allowance: {
          is_custom: isAllowanceCustom,
          allowance_id: selectedAllowances,
          amount: isAllowanceCustom ? customAllowance.amount : null,
          name: isAllowanceCustom ? customAllowance.name : null,
        },
        deduction: {
          is_custom: isDeductionCustom,
          deduction_id: selectedDeductions,
          amount: isDeductionCustom ? customDeduction.amount : null,
          name: isDeductionCustom ? customDeduction.name : null,
        },
      };
      if (baseSalaryInput.trim() !== "") {
        payload.base_salary = parseInt(baseSalaryInput, 10);
      }
      await api.post("/payroll-generates", payload);
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to generate payroll:", error);
    } finally {
      setSuccessAlert(true);
      setIsSubmitting(false);
    }
  };

  const tableData = employees
    .map((emp) => {
      if (payrolls.length === 0) {
        return {
          ...emp,
          isPaid: false,
          payrollData: null,
        };
      }
      const matchedPayroll = payrolls?.find(
        (p) =>
          p.employee_id === emp.id &&
          Number(p.month) === selectedMonth &&
          Number(p.year) === selectedYear,
      );
      return {
        ...emp,
        isPaid: !!matchedPayroll,
        payrollData: matchedPayroll,
      };
    })
    .filter((emp) =>
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const filteredPosition = position.filter(
    (p) => p.id === processingEmp?.position_id,
  );

  const handleAllowanceChange = (id: number) => {
    setSelectedAllowances((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDeductionChange = (id: number) => {
    setSelectedDeductions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  return (
    <Layout>
     {successAlert && (
      <Alert className="fixed bottom-0 right-0 m-4 shadow border-none text-success w-80 animate-[slideIn_.6s_ease-in-out]">
        <CheckCircle2Icon className="text-success" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription className="text-success/60 text-xs">
           Karayawan telah digaji
        </AlertDescription>
      </Alert>
      )}
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-2 lg:px-4 text-slate-800 bg-[#F8FAFC] pb-12 animate-[fadeIn_0.3s_ease-out]">
        <div className="mt-4">
          <h1 className="text-xl font-bold tracking-tight text-blue-dark flex items-center gap-2">
            <div className="rounded-xl flex items-center justify-center">
              <CircleDollarSign size={24} className="text-blue-dark" />
            </div>
            Manajemen Gaji Karyawan
          </h1>
          <p className="text-blue-dark/60 mt-2 text-sm">
            Pantau status pembayaran gaji dan proses penagihan bulanan.
          </p>
        </div>

        {/* Global Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-4 z-20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[250px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Cari nama karyawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 min-h-[44px] border border-border bg-background  rounded-lg focus-within:outline-blue-soft/20 focus-within:outline-3 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            {/* Month Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                className="block w-full sm:w-[160px] pl-4 pr-10 min-h-[44px] appearance-none border border-slate-200 bg-background rounded-lg focus-within:outline-blue-soft/20 focus-within:outline-3 transition-all text-sm font-semibold cursor-pointer text-slate-700"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {MONTHS.map((m, index) => (
                  <option key={m} value={index + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <Calendar size={16} />
              </div>
            </div>

            {/* Year Selector */}
            <div className="relative flex-1 sm:flex-none">
              <select
                className="block w-full sm:w-[120px] pl-4 pr-10 min-h-[44px] appearance-none border border-slate-200 bg-background rounded-lg focus-within:outline-blue-soft/20 focus-within:outline-3 transition-all text-sm font-bold cursor-pointer"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Master Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="w-full overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                <Loading message="Memuat Gaji..." />
              </div>
            ) : tableData.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                  <BanknoteX size={32} className="text-blue-dark/60" />
                </div>
                <h3 className="text-lg font-bold text-blue-dark">
                  Data Tidak Ditemukan
                </h3>
                <p className="text-blue-dark/60 mt-1 max-w-sm text-sm">
                  Cobalah mencari dengan kueri berbeda atau periksa filter
                  kembali.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-blue-dark border-collapse min-w-[700px]">
                <thead className="bg-background">
                  <tr>
                    <th className="font-semibold uppercase tracking-wider text-[11px] px-6 py-4">
                      Karyawan
                    </th>
                    <th className="font-semibold uppercase tracking-wider text-[11px] px-6 py-4">
                      Departemen & Posisi
                    </th>
                    <th className="font-semibold  uppercase tracking-wider text-[11px] px-6 py-4">
                      Periode
                    </th>
                    <th className="font-semibold uppercase tracking-wider text-[11px] px-6 py-4 text-center">
                      Status Pembayaran
                    </th>
                    <th className="font-semibold  uppercase tracking-wider text-[11px] px-6 py-4 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableData.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-blue-50/30 transition-colors group text-blue-dark"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={
                            emp.photo ||
                            `https://ui-avatars.com/api/?name=${emp.full_name}&background=f1f5f9`
                          }
                          alt={emp.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold ">{emp.full_name}</p>
                          <p className="text-xs uppercase">
                            {emp.nip || `ID: ${emp.id}`}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="block font-medium ">
                          {emp.department?.department_name || "-"}
                        </span>
                        <span className="block text-xs ">
                          {emp.position?.position_name || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold ">
                        {MONTHS[selectedMonth - 1]} {selectedYear}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {emp.isPaid ? (
                          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-md font-bold text-xs ring-1 ring-emerald-600/20">
                            <CheckCircle2 size={14} /> Lunas
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1.5 rounded-md font-bold text-xs ring-1 ring-orange-600/20">
                            <AlertCircle size={14} /> Belum Digaji
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!emp.isPaid && (
                          <button
                            onClick={() => handleOpenModal(emp)}
                            className="inline-flex items-center justify-center min-h-[36px] px-4 font-semibold text-xs bg-blue-dark text-white rounded-lg hover:bg-blue-dark/60 hover:cursor-pointer transition-all focus-within:outline-blue-soft/20 focus-within:outline-3 "
                          >
                            Proses Gaji
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && tableData.length > 0 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
              <span className="px-2 font-medium">
                Menampilkan {tableData.length} karyawan aktif
              </span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && processingEmp && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] ">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[slideUp_0.2s_ease-out] max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Proses Pembayaran Gaji
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Bulan {MONTHS[selectedMonth - 1]} {selectedYear} untuk{" "}
                {processingEmp.full_name}
              </p>
            </div>

            <form onSubmit={handleProcessPayroll} className="p-6">
              <div className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl mb-6 border border-slate-100">
                <img
                  src={
                    processingEmp.photo ||
                    `https://ui-avatars.com/api/?name=${processingEmp.full_name}&background=fff`
                  }
                  alt="Foto"
                  className="w-12 h-12 rounded-full ring-2 ring-white shadow-sm"
                />
                <div>
                  <p className="font-bold text-sm text-slate-800">
                    {processingEmp.full_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {processingEmp.department?.department_name} -{" "}
                    {processingEmp.position?.position_name}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-sm font-semibold text-blue-dark mb-1.5"
                    htmlFor="base_salary"
                  >
                    Gaji Pokok / Base Salary{" "}
                    <span className="text-slate-400 font-normal">
                      (Opsional)
                    </span>
                  </label>
                  <p className="text-xs mb-1.5">
                    {toRupiah(filteredPosition[0].base_salary)}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-blue-dark font-semibold text-sm">
                      Rp
                    </span>
                  </div>
                  <input
                    id="base_salary"
                    type="number"
                    min="0"
                    step="1000"
                    value={baseSalaryInput}
                    onChange={(e) => setBaseSalaryInput(e.target.value)}
                    placeholder="Biarkan kosong jika default"
                    className="block w-full pl-10 pr-3 min-h-[44px] border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-sm font-semibold text-blue-dark mb-1.5"
                    htmlFor="Jam Lembur"
                  >
                    Potongan{" "}
                    <span className="text-slate-400 font-normal">
                      (Opsional)
                    </span>
                  </label>
                </div>
                <Card className="w-full border-none">
                  <div className="relative">
                    <div className="px-2 pt-2">
                      <label className="sr-only">Search</label>

                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <Search size={16} />
                        </div>

                        <input
                          type="text"
                          placeholder="Cari Potongan..."
                          className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-strong border border-border text-heading text-sm rounded focus:ring-brand focus:border-brand placeholder:text-body"
                        />
                      </div>
                    </div>

                    <ul className="h-fit max-h-40 overflow-y-auto p-2 text-sm text-body font-medium">
                      {deduction.map((item) => (
                        <li
                          key={item.id}
                          className="hover:bg-background cursor-pointer"
                        >
                          <div
                            onClick={() => handleDeductionChange(item.id)}
                            className="flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer"
                          >
                            <input
                              checked={selectedDeductions.includes(item.id)}
                              type="checkbox"
                              className="w-4 h-4 border border-default-strong rounded bg-blue-dark focus:ring-2 focus:ring-blue-dark cursor-pointer"
                            />

                            <label className="w-full ms-2 text-sm font-medium text-heading cursor-pointer">
                              {item.deduction_name}
                              <span className="ml-1 text-xs text-blue-dark/60">
                                {toRupiah(item.amount)}
                              </span>
                            </label>
                          </div>
                        </li>
                      ))}
                      <li className="hover:bg-background cursor-pointer">
                        <div
                          onClick={() =>
                            setIsDeductionCustom(!isDeductionCustom)
                          }
                          className="flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isDeductionCustom}
                            className="w-4 h-4 border border-default-strong rounded bg-blue-dark focus:ring-2 focus:ring-blue-dark cursor-pointer"
                          />

                          <label className="w-full ms-2 text-sm font-medium text-heading cursor-pointer">
                            Custom?
                          </label>
                        </div>
                      </li>
                      {isDeductionCustom && (
                        <li>
                          <div className="flex flex-col w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer">
                            <label
                              htmlFor="custom-deduction"
                              className="self-start"
                            >
                              - Nama
                            </label>
                            <input
                              type="text"
                              name="name"
                              onChange={(e) =>
                                setCustomDeduction({
                                  ...customDeduction,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Exp: Potongan Etika"
                              className="block ml-2 mt-1 w-full pl-4 pe-3 py-2.5 bg-neutral-secondary-strong border border-border text-heading text-sm rounded focus:ring-brand focus:border-brand placeholder:text-body"
                            />
                          </div>
                          <div className="flex flex-col w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer">
                            <label
                              htmlFor="custom-allowance"
                              className="self-start"
                            >
                              - Jumlah
                            </label>
                            <input
                              type="text"
                              name="amount"
                              placeholder="Rp. 100000"
                              onChange={(e) =>
                                setCustomDeduction({
                                  ...customDeduction,
                                  amount: parseInt(e.target.value),
                                })
                              }
                              className="block ml-2 mt-1 w-full pl-4 pe-3 py-2.5 bg-neutral-secondary-strong border border-border text-heading text-sm rounded focus:ring-brand focus:border-brand placeholder:text-body"
                            />
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </Card>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-sm font-semibold text-blue-dark mb-1.5"
                    htmlFor="Jam Lembur"
                  >
                    Tunjangan{" "}
                    <span className="text-slate-400 font-normal">
                      (Opsional)
                    </span>
                  </label>
                </div>
                <Card className="w-full border-none">
                  <div className="relative">
                    <div className="px-2 pt-2">
                      <label className="sr-only">Search</label>

                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <Search size={16} />
                        </div>

                        <input
                          type="text"
                          placeholder="Cari Tunjangan..."
                          className="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-strong border border-border text-heading text-sm rounded focus:ring-brand focus:border-brand placeholder:text-body"
                        />
                      </div>
                    </div>
                    <ul className="h-fit max-h-40 overflow-y-auto p-2 text-sm text-body font-medium">
                      {allowance.map((item) => (
                        <li
                          key={item.id}
                          className="hover:bg-background cursor-pointer"
                        >
                          <div
                            onClick={() => handleAllowanceChange(item.id)}
                            className="flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer"
                          >
                            <input
                              checked={selectedAllowances.includes(item.id)}
                              type="checkbox"
                              className="w-4 h-4 border border-default-strong rounded bg-blue-dark focus:ring-2 focus:ring-blue-dark cursor-pointer"
                            />

                            <label className="w-full ms-2 text-sm font-medium text-heading cursor-pointer">
                              {item.allowance_name}
                              <span className="ml-1 text-xs text-blue-dark/60">
                                {toRupiah(item.amount)}
                              </span>
                            </label>
                          </div>
                        </li>
                      ))}
                      <li className="hover:bg-background cursor-pointer">
                        <div
                          onClick={() =>
                            setIsAllowanceCustom(!isAllowanceCustom)
                          }
                          className="flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isAllowanceCustom}
                            className="w-4 h-4 border border-default-strong rounded bg-blue-dark focus:ring-2 focus:ring-blue-dark cursor-pointer"
                          />

                          <label className="w-full ms-2 text-sm font-medium text-heading cursor-pointer">
                            Custom?
                          </label>
                        </div>
                      </li>
                      {isAllowanceCustom && (
                        <li>
                          <div className="flex flex-col w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer">
                            <label
                              htmlFor="custom-allowance"
                              className="self-start"
                            >
                              - Nama
                            </label>
                            <input
                              type="text"
                              name="name"
                              onChange={(e) =>
                                setCustomAllowance({
                                  ...customAllowance,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Exp: Tunjangan Transportasi"
                              className="block ml-2 mt-1 w-full pl-4 pe-3 py-2.5 bg-neutral-secondary-strong border border-border text-heading text-sm rounded focus:ring-brand focus:border-brand placeholder:text-body"
                            />
                          </div>
                          <div className="flex flex-col w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md cursor-pointer">
                            <label
                              htmlFor="custom-allowance"
                              className="self-start"
                            >
                              - Jumlah
                            </label>
                            <input
                              type="text"
                              name="amount"
                              placeholder="Rp. 100000"
                              onChange={(e) =>
                                setCustomAllowance({
                                  ...customAllowance,
                                  amount: parseInt(e.target.value),
                                })
                              }
                              className="block ml-2 mt-1 w-full pl-4 pe-3 py-2.5 bg-neutral-secondary-strong border border-border text-heading text-sm rounded focus:ring-brand focus:border-brand placeholder:text-body"
                            />
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </Card>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 cursor-pointer min-h-[44px] font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 cursor-pointer min-h-[44px] font-semibold bg-[#0062FF] text-white rounded-xl hover:bg-[#0055DD] shadow-md shadow-[#0062FF]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    "Konfirmasi Pembayaran"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
