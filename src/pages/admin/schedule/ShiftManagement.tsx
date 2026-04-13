import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { ShiftTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import type { Shift } from "../../../types/userType";
import ShiftForm from "../../../components/form/admin/ShiftForm";
import api from "../../../services/api";

export default function ShiftManagement() {
  const [open, setOpen] = useState(false);
  const [shiftData, setShiftData] = useState<Shift[]>([]);
  const [shiftForm, setShiftForm] = useState<Shift | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShift = async () => {
    try {
      const response = await api.get(`/shifts`);
      const data = response.data.data.datas.data;
      setShiftData(data);
    } catch (error) {
      console.error("fetching data error", error);
    }
  };

  useEffect(() => {
    fetchShift();
  }, []);

  const handleAddShift = async (data: Shift) => {
    setShiftForm(data);

    try {
      await api.post(`/shifts`, data);
      setShiftForm(null);
      fetchShift();
    } catch (error) {
      console.error("fetching data error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleDeleteShift = async (row: Shift) => {
    try {
      await api.delete(`/shifts/${row.id}`);
      fetchShift();
    } catch (error) {
      console.error("delete error", error);
    }
  };

  const openEditShift = (row: Shift) => {
    setShiftForm(row);
    setOpen(true);
  };

  const handleUpdateShift = async (data: Shift) => {
    try {
      await api.post(`/shifts/${shiftForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchShift();
      setShiftForm(null);
      setOpen(false);
    } catch (error) {
      console.error("update error", error);
    }
  };

  const filteredData = shiftData.filter((item) =>
    item.shift_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                  placeholder="Cari shift..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setShiftForm(null);
                  setOpen(true);
                }}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Shift
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          <ShiftTable
            data={filteredData}
            onEdit={(row) => openEditShift(row)}
            onDelete={(row) => handleDeleteShift(row)}
          />
        </div>
      </Card>

      <SideModal
        title={shiftForm ? "Edit Shift" : "Tambah Shift"}
        open={open}
        onClose={() => {
          setOpen(false);
          setShiftForm(null);
        }}
      >
        <ShiftForm
          onCancel={() => {
            setOpen(false);
            setShiftForm(null);
          }}
          onSubmit={shiftForm ? handleUpdateShift : handleAddShift}
          defaultValue={shiftForm ? [shiftForm] : []}
        />
      </SideModal>
    </>
  );
}
