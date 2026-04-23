import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { PositionTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import type { Position } from "../../../types/userType";
import PositionForm from "../../../components/form/admin/PositionForm";
import api from "../../../services/api";
import { Paginate } from "../../../components/ui/paginate";
import { Loading } from "../../../components/ui/load";

export default function Position() {
  const [open, setOpen] = useState(false);
  const [positionData, setPositionData] = useState<Position[]>([]);
  const [positionForm, setPositionForm] = useState<Position | null>(null);
  const [loading, setLoading] = useState(false);
  const [paginateData, setPaginateData] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [totalData, setTotalData] = useState(0);

  const fetchPosition = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/positions?page=${paginateData.current_page}`,
      );
      const data = response.data.data.datas.data;
      setPositionData(data);
      setTotalData(response.data.data.datas.total);
      setPaginateData({
        current_page: response.data.data.datas.current_page,
        last_page: response.data.data.datas.last_page,
      });
      setTotalData(response.data.data.datas.total);
      setPaginateData({
        current_page: response.data.data.datas.current_page,
        last_page: response.data.data.datas.last_page,
      });
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
  }, [paginateData.current_page]);

  const handleAddPosition = async (data: Position) => {
    setPositionForm(data);

    try {
      await api.post(`/positions`, data);
      setPositionForm(null);
      fetchPosition();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleDeletePosition = async (row: Position) => {
    try {
      await api.delete(`/positions/${row.id}`);
      fetchPosition();
    } catch (error) {
      console.error("delete error", error);
    }
  };

  const openEditPosition = (row: Position) => {
    setPositionForm(row);
    setOpen(true);
  };

  const handleUpdatePosition = async (data: Position) => {
    try {
      await api.post(`/positions/${positionForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchPosition();
      setPositionForm(null);
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
            <div className="flex justify-end items-center">
              <div className="flex w-50 border-border border rounded-md px-4 py-2">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari posisi..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Posisi
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          {loading ? (
            <Loading message="loading data..." />
          ) : (
            <PositionTable
              data={positionData}
              onEdit={(row) => openEditPosition(row)}
              onDelete={(row) => handleDeletePosition(row)}
            />
          )}
        </div>
        <Paginate
          data={positionData}
          totalData={totalData}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
        />
      </Card>

      <SideModal
        title={positionForm ? "Edit Position" : "Add Position"}
        open={open}
        onClose={() => {
          setOpen(false);
          setPositionForm(null);
        }}
      >
        <PositionForm
          onCancel={() => {
            setOpen(false);
            setPositionForm(null);
          }}
          onSubmit={positionForm ? handleUpdatePosition : handleAddPosition}
          defaultValue={positionForm ? [positionForm] : []}
        />
      </SideModal>
    </>
  );
}
