import { useState } from "react";
import { Loader2, CalendarPlus, CheckCircle2 } from "lucide-react";
import SelectField from "../ui/selectField";
import type { Department } from "../../types/userType";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

type ScheduleGeneratorProps = {
  departments: Department[];
  monthOptions: { id: number; label: string }[];
  yearOptions: { id: number; label: string }[];
  currentMonth: number;
  currentYear: number;
  onSuccess: (deptId: number, month: number, year: number) => void;
};

export default function ScheduleGenerator({
  departments,
  monthOptions,
  yearOptions,
  currentMonth,
  currentYear,
  onSuccess,
}: ScheduleGeneratorProps) {
  const { user } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [departmentId, setDepartmentId] = useState<number | string>(
    departments[0]?.id || "",
  );
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  console.log(user);

  const handleGenerate = async () => {
    if (!departmentId) {
      setError("Pilih departemen terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/shift-schedules", {
        departement_id: Number(departmentId),
        created_by: user?.name,
        month,
        year,
      });

      const shiftSchedule = response?.data?.data?.datas;

      if (!shiftSchedule || !shiftSchedule.id) {
        throw new Error("ID jadwal tidak ditemukan dari response");
      }

      const shiftScheduleId = shiftSchedule.id;

      await api.post("/shift-schedule-details", {
        shift_schedule_id: shiftScheduleId,
      });

      setSuccessMsg("Jadwal shift berhasil dibuat!");
      setTimeout(() => {
        onSuccess(Number(departmentId), month, year);
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      console.error("Gagal membuat jadwal:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal membuat jadwal. Jadwal mungkin sudah ada atau terjadi kesalahan server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-border p-6 shadow-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-primary">
          <CalendarPlus size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-blue-dark">
            Generate Jadwal Baru
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Buat jadwal shift kosong (Pagi) untuk satu bulan penuh yang nantinya
            bisa diubah.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50/50 border border-green-200 rounded-lg flex items-start gap-3 animate-[slideIn_0.3s_ease-out]">
          <CheckCircle2
            size={20}
            className="text-green-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <h4 className="font-semibold text-green-800">Berhasil!</h4>
            <p className="text-sm text-green-700 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-[fadeIn_0.3s_ease-out]">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Departemen"
            name="generate_dept"
            options={departments.map((d) => ({
              id: d.id,
              label: d.department_name,
            }))}
            defaultValue={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Bulan"
            name="generate_month"
            options={monthOptions}
            defaultValue={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          <SelectField
            label="Tahun"
            name="generate_year"
            options={yearOptions}
            defaultValue={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !!successMsg}
            className="flex items-center gap-2 bg-blue-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : successMsg ? (
              <>
                <CheckCircle2 size={18} />
                <span>Berhasil</span>
              </>
            ) : (
              <>
                <CalendarPlus size={18} />
                <span>Generate Jadwal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
