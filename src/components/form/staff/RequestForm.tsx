import { useEffect, useState } from "react";
import type { LeaveRequest, LeaveType } from "../../../types/userType";
import InputField from "../../ui/inputField";
import SelectField from "../../ui/selectField";
import api from "../../../services/api";

type RequestFormProps = {
  defaultValue?: LeaveRequest[];
  onCancel: () => void;
  onSubmit: (data: LeaveRequest) => void;
};

export default function RequestForm({
  defaultValue,
  onCancel,
  onSubmit,
}: RequestFormProps) {
  const [leaveType, setLeaveType] = useState([]);

  useEffect(() => {
    const fetchLeaveType = async () => {
      const response = await api.get(`/leave-types`);
      const data = response?.data.data.datas.data;
      setLeaveType(data);
      console.log(data);
    };
    fetchLeaveType();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: LeaveRequest = {
      id: defaultValue?.[0]?.id || 0,
      leave_type_id: Number(formData.get("leave_type_id")) as number,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      reason: formData.get("reason") as string,
      status: "pending",
      approved_by: "",
      approved_at: "",
      employee_id: Number(formData.get("employee_id")) as number,
      employee: {
        id: 0,
        full_name: "",
        position: {
          id: 0,
          position_name: "",
        },
        department: {
          id: 0,
          department_name: "",
        },
      },
      leave_type: {
        id: 0,
        leave_type_name: "",
      },
      created_at: "",
      updated_at: "",
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <SelectField
        label="Jenis Cuti"
        name="leave_type_id"
        options={leaveType.map((data: LeaveType) => {
          return {
            id: data.id,
            label: data?.leave_type_name,
          };
        })}
        defaultValue={defaultValue?.[0]?.leave_type_id}
      />
      <InputField
        label="Alasan"
        name="reason"
        placeholder="exp: Menghadiri pernikahan saudara"
        defaultValue={defaultValue?.[0]?.reason}
      />

      <InputField
        label="Tanggal Mulai"
        name="start_date"
        type="date"
        placeholder="exp: 1985-03-20"
        defaultValue={defaultValue?.[0]?.start_date}
      />

      <InputField
        label="Tanggal Selesai"
        name="end_date"
        type="date"
        placeholder="exp: 1985-03-20"
        defaultValue={defaultValue?.[0]?.end_date}
      />

      <div className="flex gap-2 mt-2">
        <button className="auth-gradient text-white w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer transition">
          Simpan
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-destructive/20 text-destructive w-30 px-4 py-2 rounded-md text-sm hover:-translate-y-1 hover:cursor-pointer hover:bg-destructive hover:text-white transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
