import { useEffect, useState } from "react";
import type { Employee, Role, User } from "../../../types/userType";
import InputField from "../../ui/inputField";
import axios from "axios";
import SelectField from "../../ui/selectField";
import api from "../../../services/api";

type UserFormProps = {
  defaultValue?: User[];
  onCancel: () => void;
  onSubmit: (data: User) => void;
};

export default function UserForm({
  defaultValue,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [role, setRole] = useState<Role[]>([]);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees`);
      const data = response.data.data.datas.data;
      setEmployee(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  const fetchRole = async () => {
    try {
      const response = await api.get(`/roles`);
      const data = response.data.data.datas.data;
      setRole(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
    fetchRole();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data: User = {
      employee_id: Number(formData.get("employee_id")) as number,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role_id: Number(formData.get("role_id")) as number,
      is_active: Number(formData.get("is_active")) as number,
      device_id: formData.get("device_id") as string,
      last_login_at: "",
      employee: {
        id: 0,
        full_name: "",
      },
      role: {
        id: 0,
        role_name: "",
      },
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <SelectField
        label="Employee Identity"
        name="employee_id"
        options={employee.map((item) => ({
          id: item.id,
          label: item.full_name,
        }))}
        defaultValue={defaultValue?.[0]?.employee.id}
      />

      <InputField
        label="Username"
        name="name"
        placeholder="exp: faster"
        defaultValue={defaultValue?.[0]?.name}
      />

      <InputField
        label="Email"
        name="email"
        placeholder="exp: faster@admin.com"
        defaultValue={defaultValue?.[0]?.email}
      />

      <InputField
        label="Password"
        name="password"
        placeholder="exp: password123"
        defaultValue={""}
      />

      <SelectField
        label="Role"
        name="role_id"
        options={role.map((item) => ({
          id: item.id,
          label: item.role_name,
        }))}
        defaultValue={defaultValue?.[0]?.role.id}
      />

      <SelectField
        label="Status"
        name="is_active"
        options={[
          { id: 1, label: "Aktif" },
          { id: 0, label: "Tidak Aktif" },
        ]}
        defaultValue={defaultValue?.[0]?.is_active}
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
