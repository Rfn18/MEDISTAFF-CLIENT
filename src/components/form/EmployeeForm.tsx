import { useEffect, useState } from "react";
import type { Department, Employee, Position } from "../../types/userType";
import InputField from "../ui/inputField";
import axios from "axios";
import SelectField from "../ui/selectField";

type EmployeeFormProps = {
  defaultValue?: Employee[];
  onCancel: () => void;
  onSubmit: (data: Employee) => void;
};

export default function EmployeeForm({
  defaultValue,
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [position, setPosition] = useState<Position[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);

  const fetchPosition = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/positions`);
      const data = response.data.data.datas.data;
      setPosition(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/departments`);
      const data = response.data.data.datas.data;
      setDepartment(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchPosition();
    fetchDepartment();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const gender = formData.get("gender") === "Laki-laki" ? "male" : "female";

    const data: Employee = {
      id: defaultValue?.[0]?.id || 0,
      nip: formData.get("nip") as string,
      nik: formData.get("nik") as string,
      full_name: formData.get("full_name") as string,
      gender: gender as string,
      birth_place: formData.get("birth_place") as string,
      birth_date: formData.get("birth_date") as string,
      address: formData.get("address") as string,
      phone_number: formData.get("phone_number") as string,
      email: formData.get("email") as string,
      hire_date: formData.get("hire_date") as string,
      employee_status: formData.get("employee_status") as string,
      position_id: Number(formData.get("position_id")),
      department_id: Number(formData.get("department_id")),
      position: {
        id: 0,
        position_name: "",
      },
      department: {
        id: 0,
        department_name: "",
      },
    };

    onSubmit(data);
  };

  console.log(defaultValue?.[0]?.employee_status);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        label="NIP"
        name="nip"
        placeholder="exp: 3174051201900001"
        defaultValue={defaultValue?.[0]?.nip}
      />
      <InputField
        label="NIK"
        name="nik"
        placeholder="exp: 198503202010011005"
        defaultValue={defaultValue?.[0]?.nik}
      />

      <InputField
        label="Nama Lengkap"
        name="full_name"
        placeholder="Masukkan nama lengkap"
        defaultValue={defaultValue?.[0]?.full_name}
      />

      <InputField
        label="Tempat Lahir"
        name="birth_place"
        placeholder="exp: Jakarta"
        defaultValue={defaultValue?.[0]?.birth_place}
      />

      <InputField
        label="Tanggal Lahir"
        name="birth_date"
        type="date"
        placeholder="exp: 1985-03-20"
        defaultValue={defaultValue?.[0]?.birth_date}
      />

      <InputField
        label="Nomor Telepon"
        name="phone_number"
        placeholder="exp: 08123456789"
        defaultValue={defaultValue?.[0]?.phone_number}
      />

      <InputField
        label="Email"
        name="email"
        placeholder="exp: faster@admin.com"
        defaultValue={defaultValue?.[0]?.email}
      />

      <InputField
        label="Tanggal Masuk Kerja"
        name="hire_date"
        type="date"
        placeholder="exp: 1985-03-20"
        defaultValue={defaultValue?.[0]?.hire_date}
      />

      <InputField
        label="Alamat Karyawan"
        name="address"
        placeholder="exp: Jl. Contoh No. 123"
        defaultValue={defaultValue?.[0]?.address}
      />

      <SelectField
        label="Gender"
        name="gender"
        options={[
          { id: "Laki-laki", label: "Laki-laki" },
          { id: "Perempuan", label: "Perempuan" },
        ]}
        defaultValue={defaultValue?.[0]?.gender || ""}
      />

      <SelectField
        label="Posisi"
        name="position_id"
        options={position.map((item) => ({
          id: item.id,
          label: item.position_name,
        }))}
        defaultValue={defaultValue?.[0]?.position.id}
      />

      <SelectField
        label="Department"
        name="department_id"
        options={department.map((item) => ({
          id: item.id,
          label: item.department_name,
        }))}
        defaultValue={defaultValue?.[0]?.department.id || ""}
      />

      {defaultValue?.[0]?.id && (
        <SelectField
          label="Status"
          name="employee_status"
          options={[
            { id: "active", label: "Aktif" },
            { id: "inactive", label: "Tidak Aktif" },
            { id: "on_leave", label: "Cuti" },
            { id: "resigned", label: "Resign" },
            { id: "terminated", label: "PHK" },
          ]}
          defaultValue={defaultValue?.[0]?.employee_status || ""}
        />
      )}

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
