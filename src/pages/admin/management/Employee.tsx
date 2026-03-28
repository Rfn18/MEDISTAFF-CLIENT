import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { EmployeeTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import EmployeeForm from "../../../components/form/admin/EmployeeForm";
import type { Employee as EmployeeType } from "../../../types/userType";
import axios from "axios";

export default function Employee() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [open, setOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeType[]>([]);
  const [employeeForm, setEmployeeForm] = useState<EmployeeType | null>(null);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/employees`);
      const data = response.data.data.datas.data;
      setEmployeeData(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleAddEmployee = async (data: EmployeeType) => {
    setEmployeeForm(data);

    try {
      await axios.post(`${baseUrl}/api/employees`, data);
      setEmployeeForm(null);
      fetchEmployee();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleInactivateEmployee = async (row: EmployeeType) => {
    const newStatus = row.employee_status === "active" ? "inactive" : "active";
    try {
      const response = await axios.post(
        `${baseUrl}/api/employees/${row.id}/status`,
        {
          employee_status: newStatus,
          _method: "PUT",
        },
      );
      console.log(response);
      fetchEmployee();
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  const openEditEmployee = (row: EmployeeType) => {
    setEmployeeForm(row);
    setOpen(true);
  };

  const handleUpdateEmployee = async (data: EmployeeType) => {
    try {
      await axios.post(`${baseUrl}/api/employees/${employeeForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchEmployee();
      setEmployeeForm(null);
      setOpen(false);
    } catch (error) {
      console.error("update error", error);
    }
  };

  return (
    <>
      <Card className="gap-4 min-w-60 border-none py-6 px-5 ">
        <CardHeader className="border-none m-0 p-0">
          <h1 className="text-md font-bold mb-2 ">Search Filter</h1>
          <div className="w-full flex justify-between items-center">
            <div>
              <select className="w-50 px-4 py-2 border border-border rounded-md text-sm">
                <option value="">deparment</option>
              </select>
              <select className="w-50 px-4 py-2 border border-border rounded-md text-sm ml-4">
                <option value="">posisi</option>
              </select>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex w-50 border-border border rounded-md px-4 py-2">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari karyawan..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Karyawan
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          <EmployeeTable
            data={employeeData}
            onEdit={(row) => openEditEmployee(row)}
            onActivate={(row) => handleInactivateEmployee(row)}
          />
        </div>
      </Card>

      <SideModal
        title={employeeForm ? "Edit Employee" : "Add Employee"}
        open={open}
        onClose={() => {
          setOpen(false);
          setEmployeeForm(null);
        }}
      >
        <EmployeeForm
          onCancel={() => {
            setOpen(false);
            setEmployeeForm(null);
          }}
          onSubmit={employeeForm ? handleUpdateEmployee : handleAddEmployee}
          defaultValue={employeeForm ? [employeeForm] : []}
        />
      </SideModal>
    </>
  );
}
