import { Box, Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../../components/ui/card";
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import type { Allowance } from "../../../../types/payrollType";
import { AllowanceTable } from "../../../../components/payroll/PayrollComponents";
import SideModal from "../../../../components/ui/Modal";
import { AllowanceForm } from "../../../../components/form/admin/PayrollComponentForm";
import { Loading } from "../../../../components/ui/load";
export default function Allowance() {
  const [open, setOpen] = useState(false);
  const [allowanceData, setAllowanceData] = useState<Allowance[]>([]);
  const [allowanceForm, setAllowanceForm] = useState<Allowance | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAllowance = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/allowances`);
      const data = response.data.data.datas.data;
      setAllowanceData(data);
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowance();
  }, []);

  const handleAddAllowance = async (data: Allowance) => {
    setAllowanceForm(data);

    try {
      setLoading(true);
      await api.post(`/allowances`, data);
      setAllowanceForm(null);
      fetchAllowance();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const handleDeleteAllowance = async (row: Allowance) => {
    try {
      setDeleteLoading(true);
      await api.delete(`/allowances/${row.id}`);
      fetchAllowance();
    } catch (error) {
      console.error("delete error", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditAllowance = (row: Allowance) => {
    setAllowanceForm(row);
    setOpen(true);
  };

  const handleUpdateAllowance = async (data: Allowance) => {
    try {
      setLoading(true);
      await api.post(`/allowances/${allowanceForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchAllowance();
      setAllowanceForm(null);
      setOpen(false);
    } catch (error) {
      console.error("update error", error);
    } finally {
      setLoading(false);
    }
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
                  placeholder="Cari tunjangan..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah tunjangan
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          {loading ? (
            <Loading message="Memuat data tunjangan..." />
          ) : allowanceData.length > 0 ? (
            <AllowanceTable
              loading={deleteLoading}
              data={allowanceData}
              onEdit={(row) => openEditAllowance(row)}
              onDelete={(row) => handleDeleteAllowance(row)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-16 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-blue-primary/60" />
              </div>
              <p className="text-lg font-bold text-blue-dark">
                Belum ada tunjangan
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Saat ini tidak ada data tunjangan yang perlu ditinjau.
              </p>
            </div>
          )}
        </div>
      </Card>

      <SideModal
        title={allowanceForm ? "Edit Allowance" : "Add Allowance"}
        open={open}
        onClose={() => {
          setOpen(false);
          setAllowanceForm(null);
        }}
      >
        <AllowanceForm
          onCancel={() => {
            setOpen(false);
            setAllowanceForm(null);
          }}
          loading={loading}
          onSubmit={allowanceForm ? handleUpdateAllowance : handleAddAllowance}
          defaultValue={allowanceForm ? [allowanceForm] : []}
        />
      </SideModal>
    </>
  );
}
