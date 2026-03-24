import {
  BriefcaseBusiness,
  Building,
  User,
  Users,
} from "lucide-react";
import Layout from "../../components/layouts/DashboardLayout";
import { useState } from "react";
import Employee from "./management/Employee";
import Department from "./management/Department";

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState("karyawan");

  return (
    <Layout>
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
        {activeTab === "karyawan" && <Employee />}
        {activeTab === "department" && <Department />}
      </div>
    </Layout>
  );
};

export default ManagementPage;
