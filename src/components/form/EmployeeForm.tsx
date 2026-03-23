import { useEffect } from "react";
import type { Employee } from "../../types/employee";
import InputField from "../ui/inputField";
import axios from "axios";

type EmployeeFormProps = {
  defaultValue?: Employee;
  onCancel: () => void;
  onSubmit: (data: Employee) => void;
};

export default function EmployeeForm({
  defaultValue,
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: Employee = {
      nip: formData.get("nip") as string,
      nik: formData.get("nik") as string,
      full_name: formData.get("full_name") as string,
      gender: formData.get("gender") as string,
      birth_place: formData.get("birth_place") as string,
      birth_date: formData.get("birth_date") as string,
      address: formData.get("address") as string,
      phone_number: formData.get("phone_number") as string,
      email: formData.get("email") as string,
      hire_date: formData.get("hire_date") as string,
      employee_status: formData.get("employment_status") as string,
      position_id: Number(formData.get("position_id")),
      department_id: Number(formData.get("department_id")),
      role_id: Number(formData.get("role_id")),
      status: "",
      position: {
        id: 0,
        position_name: "",
      },
      department: {
        id: 0,
        department_name: "",
      },
    };

    try {
      const resposne = await axios.post(
        "http://127.0.0.1:8000/api/employees",
        data,
      );
      console.log(resposne);
    } catch (error) {
      console.error("failed to add employee", error);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField label="NIP" name="nip" defaultValue={defaultValue?.nip} />
      <InputField label="NIK" name="nik" defaultValue={defaultValue?.nik} />

      <InputField
        label="Full Name"
        name="full_name"
        defaultValue={defaultValue?.full_name}
      />

      <InputField
        label="Birth Place"
        name="birth_place"
        defaultValue={defaultValue?.birth_place}
      />

      <InputField
        label="Birth Date"
        name="birth_date"
        type="date"
        defaultValue={defaultValue?.birth_date}
      />

      <InputField
        label="Phone Number"
        name="phone_number"
        defaultValue={defaultValue?.phone_number}
      />

      <InputField
        label="Email"
        name="email"
        defaultValue={defaultValue?.email}
      />

      <InputField
        label="Hire Date"
        name="hire_date"
        type="date"
        defaultValue={defaultValue?.hire_date}
      />

      <InputField
        label="Employee Address"
        name="address"
        defaultValue={defaultValue?.address}
      />

      <InputField
        label="Gender"
        name="gender"
        defaultValue={defaultValue?.gender}
      />

      <InputField
        label="Position ID"
        name="position_id"
        defaultValue={defaultValue?.position_id?.toString()}
      />

      <InputField
        label="Department ID"
        name="department_id"
        defaultValue={defaultValue?.department_id?.toString()}
      />

      <InputField
        label="Role ID"
        name="role_id"
        defaultValue={defaultValue?.role_id?.toString()}
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
