import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { DepartmentTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import DepartmentForm from "../../../components/form/admin/DepartmentForm";
import type { Department as DepartmentType } from "../../../types/userType";
import axios from "axios";
import api from "../../../services/api";

export default function Department() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [open, setOpen] = useState(false);
  const [departmentData, setDepartmentData] = useState<DepartmentType[]>([]);
  const [departmentForm, setDepartmentForm] = useState<DepartmentType | null>(
    null,
  );

  const fetchDepartment = async () => {
    try {
      const response = await api.get(`/departments`);
      const data = response.data.data.datas.data;
      setDepartmentData(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const handleAddDepartment = async (data: DepartmentType) => {
    setDepartmentForm(data);

    try {
      await axios.post(`${baseUrl}/api/departments`, data);
      setDepartmentForm(null);
      fetchDepartment();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleUpdateDepartment = async (data: DepartmentType) => {
    try {
      await api.post(`/departments/${departmentForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchDepartment();
      setDepartmentForm(null);
      setOpen(false);
    } catch (error) {
      console.error("update error", error);
    }
  };

  const handleDeleteDepartment = async (row: DepartmentType) => {
    try {
      await api.delete(`/departments/${row.id}`);
      fetchDepartment();
    } catch (error) {
      console.error("delete error", error);
    }
  };

  const openEditDepartment = (row: DepartmentType) => {
    setDepartmentForm(row);
    setOpen(true);
  };

  return (
    <>
      <Card className="gap-4 min-w-60 border-none py-6 px-5 ">
        <CardHeader className="border-none m-0 p-0">
          <h1 className="text-md font-bold mb-2 ">Search Filter</h1>
          <div className="w-full flex justify-between items-center">
            <div className="flex justify-end items-center">
              <div className="flex w-50 border-border border rounded-md px-4 py-2">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari Department..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Department
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          <DepartmentTable
            data={departmentData}
            onEdit={(row) => openEditDepartment(row)}
            onDelete={(row) => handleDeleteDepartment(row)}
          />
        </div>
      </Card>

      <SideModal
        title={departmentForm ? "Edit Department" : "Add Department"}
        open={open}
        onClose={() => {
          setOpen(false);
          setDepartmentForm(null);
        }}
      >
        <DepartmentForm
          onCancel={() => {
            setOpen(false);
            setDepartmentForm(null);
          }}
          onSubmit={
            departmentForm ? handleUpdateDepartment : handleAddDepartment
          }
          defaultValue={departmentForm ? [departmentForm] : []}
        />
      </SideModal>
    </>
  );
}
