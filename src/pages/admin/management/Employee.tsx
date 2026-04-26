import { CheckCircle2, Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { EmployeeTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import EmployeeForm from "../../../components/form/admin/EmployeeForm";
import type { Employee as EmployeeType } from "../../../types/userType";
import api from "../../../services/api";
import { Paginate } from "../../../components/ui/paginate";
import { Loading } from "../../../components/ui/load";
import { SelectListModal } from "../../../components/ui/selectListModal";

export default function Employee() {
  const [open, setOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeType[]>([]);
  const [employeeForm, setEmployeeForm] = useState<EmployeeType | null>(null);
  const [paginateData, setPaginateData] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/employees/search?page=${paginateData.current_page}&search=${searchValue}`,
      );
      const data = response.data.data.datas.data;
      setEmployeeData(data);
      setTotalData(response.data.data.datas.total);
      setPaginateData({
        current_page: response.data.data.datas.current_page,
        last_page: response.data.data.datas.last_page,
      });
    } catch (error) {
      console.error("fething data error", error);
      setError("Failed to fetch employee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployee();
    }, 500);
    return () => clearTimeout(timer);
  }, [paginateData.current_page, searchValue]);

  const handleAddEmployee = async (data: EmployeeType) => {
    setEmployeeForm(data);

    try {
      await api.post(`/employees`, data);
      setEmployeeForm(null);
      fetchEmployee();
      setSuccessMsg("Employee added successfully");
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (error) {
      console.error("fething data error", error);
      setError("Failed to add employee");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setOpen(false);
    }
  };

  const handleInactivateEmployee = async (row: EmployeeType) => {
    const newStatus = row.employee_status === "active" ? "inactive" : "active";
    try {
      await api.post(`/employees/${row.id}/status`, {
        employee_status: newStatus,
        _method: "PUT",
      });
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
      await api.post(`/employees/${employeeForm?.id}`, {
        ...data,
        _method: "PUT",
      });
      setSuccessMsg("Employee updated successfully");
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (error) {
      console.error("update error", error);
      setError("Failed to update employee");
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setOpen(false);
      fetchEmployee();
      setEmployeeForm(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPaginateData((prev) => ({ ...prev, current_page: 1 }));
  };

  return (
    <>
      <Card className="gap-4 min-w-60 border-none py-6 px-5 ">
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
                  value={searchValue}
                  onChange={handleSearch}
                  type="text"
                  placeholder="Cari karyawan..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                disabled={loading}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                Tambah Karyawan
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          {loading ? (
            <Loading message="loading data..." />
          ) : (
            <EmployeeTable
              data={employeeData}
              onEdit={(row) => openEditEmployee(row)}
              onActivate={(row) => handleInactivateEmployee(row)}
            />
          )}
        </div>
        <Paginate
          data={employeeData}
          totalData={totalData}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
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
          loading={loading}
          onSubmit={employeeForm ? handleUpdateEmployee : handleAddEmployee}
          defaultValue={employeeForm ? [employeeForm] : []}
        />
      </SideModal>
    </>
  );
}
