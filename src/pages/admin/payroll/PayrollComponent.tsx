import { TicketMinus, TicketPlus } from "lucide-react";
import Layout from "../../../components/layouts/DashboardLayout";
import Allowance from "./components/Allowance";
import { useState } from "react";
import Deduction from "./components/Deduction";

const PayrollComponent = () => {
  const [activeTab, setActiveTab] = useState("tunjangan");

  return (
    <Layout>
      <div className="">
        <h1 className="font-bold text-xl">Manajement Menu</h1>
        <p className="opacity-60 text-sm mt-1">
          Kelola karyawan, department, dan jabatan di rumah sakit
        </p>
        <div className="mt-4 flex bg-accent-foreground shadow w-fit p-1 rounded-xl">
          <button
            className={`flex items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "tunjangan" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
            onClick={() => setActiveTab("tunjangan")}
          >
            <TicketPlus size={16} /> Tunjangan
          </button>
          <button
            className={`flex items-center gap-2 text-sm font-semibold px-10 py-2 rounded-lg cursor-pointer ${activeTab === "potongan" ? "bg-background text-blue-dark" : "text-blue-dark/60"}`}
            onClick={() => setActiveTab("potongan")}
          >
            <TicketMinus size={16} /> Potongan
          </button>
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "tunjangan" && <Allowance />}
        {activeTab === "potongan" && <Deduction />}
      </div>
    </Layout>
  );
};

export default PayrollComponent;
