import {
  BriefcaseBusiness,
  Building,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import Layout from "../../components/layouts/DashboardLayout";
import { Card, CardHeader } from "../../components/ui/card";
import { useEffect, useState } from "react";
import EmployeeTable from "../../components/dashboard/EmployyeeDashboard";
import SideModal from "../../components/ui/sideModal";
import EmployeeForm from "../../components/form/EmployeeForm";
import type { Employee } from "../../types/employee";
import axios from "axios";

const ManagementPage = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [employeeValue, setEmployeeValue] = useState();

  const fetchEmployee = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/employees");
      const data = response.data.data.datas.data;
      console.log(data);
      setEmployeeData(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  console.log(employeeData);
  return (
    <>
      <Layout>
        {" "}
        <div className="">
          <h1 className="font-bold text-xl">Manajement Menu</h1>
          <p className="opacity-60 text-sm mt-1">
            Kelola karyawan, department, dan jabatan di rumah sakit
          </p>
          <div className="mt-4 flex bg-accent-foreground shadow w-fit p-1 rounded-xl">
            <button
              className={`flex items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "karyawan" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
              onClick={() => setActiveTab("karyawan")}
            >
              <Users size={16} /> Karyawan
            </button>
            <button
              className={`flex items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "department" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
              onClick={() => setActiveTab("department")}
            >
              <Building size={16} /> Department
            </button>
            <button
              className={`flex items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "jabatan" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
              onClick={() => setActiveTab("jabatan")}
            >
              <BriefcaseBusiness size={16} /> Jabatan
            </button>
            <button
              className={`flex items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "user" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
              onClick={() => setActiveTab("user")}
            >
              <User size={16} /> User
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Card className="gap-4 min-w-60 border-none py-6 px-5 ">
            <CardHeader className="border-none m-0 p-0">
              <h1 className="text-md font-bold mb-2 ">Search Filter</h1>
              <div className="w-full flex justify-between items-center">
                <div>
                  <select className="w-50 px-4 py-2 border border-border rounded-md text-sm">
                    <option value="">deparment</option>
                  </select>
                  <select className="w-50 px-4 py-2 border border-border rounded-md text-sm ml-4">
                    <option value="">jabatan</option>
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
              {(activeTab === "karyawan" && (
                <EmployeeTable data={employeeData} />
              )) ||
                (activeTab === "department" && <h1>department</h1>)}
            </div>
          </Card>
        </div>
      </Layout>

      <SideModal
        title="Add Employee"
        open={open}
        onClose={() => setOpen(false)}
      >
        <EmployeeForm
          onCancel={() => setOpen(false)}
          onSubmit={(data) => console.log(data)}
        />
      </SideModal>
    </>
  );
};

export default ManagementPage;
