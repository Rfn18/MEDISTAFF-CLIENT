import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { DepartmentTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import DepartmentForm from "../../../components/form/admin/DepartmentForm";
import type { Department as DepartmentType } from "../../../types/userType";
import api from "../../../services/api";
import { Paginate } from "../../../components/ui/paginate";
import { Loading } from "../../../components/ui/load";

export default function Department() {
  const [open, setOpen] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [departmentData, setDepartmentData] = useState<DepartmentType[]>([]);
  const [paginateData, setPaginateData] = useState({
    current_page: 1,
    last_page: 1,
  });

  const [departmentForm, setDepartmentForm] = useState<DepartmentType | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/departments?page=${paginateData.current_page}`,
      );
      const data = response.data.data.datas.data;
      setDepartmentData(data);
      setPaginateData({
        current_page: response.data.data.datas.current_page,
        last_page: response.data.data.datas.last_page,
      });
      setTotalData(response.data.data.datas.total);
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [paginateData.current_page]);

  const handleAddDepartment = async (data: DepartmentType) => {
    setDepartmentForm(data);

    try {
      await api.post(`/departments`, data);
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
          {loading ? (
            <Loading message="loading data..." />
          ) : (
            <DepartmentTable
              data={departmentData}
              onEdit={(row) => openEditDepartment(row)}
              onDelete={(row) => handleDeleteDepartment(row)}
            />
          )}
        </div>
        <Paginate
          data={departmentData}
          totalData={totalData}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
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
