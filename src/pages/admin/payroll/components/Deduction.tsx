import { Box, Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../../components/ui/card";
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import type { Deduction } from "../../../../types/payrollType";
import { DeductionTable } from "../../../../components/payroll/PayrollComponents";
import SideModal from "../../../../components/ui/Modal";
import { DeductionForm } from "../../../../components/form/admin/PayrollComponentForm";
import { Loading } from "../../../../components/ui/load";

export default function Deduction() {
  const [open, setOpen] = useState(false);
  const [deductionData, setDeductionData] = useState<Deduction[]>([]);
  const [deductionForm, setDeductionForm] = useState<Deduction | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDeduction = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/deductions`);
      const data = response.data.data.datas.data;
      setDeductionData(data);
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeduction();
  }, []);

  const handleAddDeduction = async (data: Deduction) => {
    setDeductionForm(data);

    try {
      setLoading(true);
      await api.post(`/deductions`, data);
      setDeductionForm(null);
      fetchDeduction();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleDeleteDeduction = async (row: Deduction) => {
    try {
      setDeleteLoading(true);
      await api.delete(`/deductions/${row.id}`);
      fetchDeduction();
    } catch (error) {
      console.error("delete error", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditDeduction = (row: Deduction) => {
    setDeductionForm(row);
    setOpen(true);
  };

  const handleUpdateDeduction = async (data: Deduction) => {
    try {
      setLoading(true);
      await api.post(`/deductions/${deductionForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchDeduction();
      setDeductionForm(null);
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
                Tambah potongan
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          {loading ? (
            <Loading message="Memuat data potongan..." />
          ) : deductionData.length > 0 ? (
            <DeductionTable
              loading={deleteLoading}
              data={deductionData}
              onEdit={(row) => openEditDeduction(row)}
              onDelete={(row) => handleDeleteDeduction(row)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-16">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-blue-primary/60" />
              </div>
              <p className="text-lg font-bold text-blue-dark">
                Belum ada potongan
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Saat ini tidak ada data potongan yang perlu ditinjau.
              </p>
            </div>
          )}
        </div>
      </Card>

      <SideModal
        title={deductionForm ? "Edit Potongan" : "Tambah Potongan"}
        open={open}
        onClose={() => {
          setOpen(false);
          setDeductionForm(null);
        }}
      >
        <DeductionForm
          loading={loading}
          onCancel={() => {
            setOpen(false);
            setDeductionForm(null);
          }}
          onSubmit={deductionForm ? handleUpdateDeduction : handleAddDeduction}
          defaultValue={deductionForm ? [deductionForm] : []}
        />
      </SideModal>
    </>
  );
}
