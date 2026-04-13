import Layout from "../../components/layouts/DashboardLayout";
import {
  MailQuestionMark,
  CircleCheck,
  CircleX,
  Box,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { LeaveRequestTable } from "../../components/leaveRequest/UserRequest";
import { useEffect, useState } from "react";
import type { LeaveRequest } from "../../types/userType";
import api from "../../services/api";
import SideModal from "../../components/ui/Modal";
import RequestForm from "../../components/form/staff/RequestForm";

const LeaveRequestPage = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [leaveData, setLeaveData] = useState<LeaveRequest[]>([]);
  const [leaveForm, setLeaveForm] = useState<LeaveRequest | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const fetchLeaveData = async () => {
    try {
      const response = await api.get(`/leave-request/by`);
      const data = response?.data.data.datas.data;
      setLeaveData(data);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const openEditLeave = (row: LeaveRequest) => {
    setLeaveForm(row);
    setOpen(true);
  };

  const handleDeleteLeave = async (row: LeaveRequest) => {
    try {
      await api.delete(`${baseUrl}/api/leave-requests/${row.id}`);
      fetchLeaveData();
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

  const handleEditLeave = async (data: LeaveRequest) => {
    try {
      await api.put(`${baseUrl}/api/leave-requests/${data.id}`, data);
      fetchLeaveData();
    } catch (error) {
      console.error("Error editing leave request:", error);
    } finally {
      setOpen(false);
      setLeaveForm(null);
    }
  };

  const handleAddLeave = async (data: LeaveRequest) => {
    setLeaveForm(data);
    try {
      await api.post(`/leave-requests`, data);
      fetchLeaveData();
    } catch (error) {
      console.error("Error adding leave request:", error);
    } finally {
      setOpen(false);
      setLeaveForm(null);
    }
  };

  const countApproved = leaveData.filter(
    (item) => item.status === "approved",
  ).length;
  const countRejected = leaveData.filter(
    (item) => item.status === "rejected",
  ).length;
  const countPending = leaveData.filter(
    (item) => item.status === "pending",
  ).length;
  const cardItem = [
    {
      id: 1,
      title: "Disetujui",
      amount: countApproved,
      icon: CircleCheck,
    },
    {
      id: 2,
      title: "Ditolak",
      amount: countRejected,
      icon: CircleX,
    },
    {
      id: 3,
      title: "Pending",
      amount: countPending,
      icon: MailQuestionMark,
    },
  ];

  const COLOR_MAP = {
    1: {
      bg: "bg-success/10",
      text: "text-success",
    },
    2: {
      bg: "bg-destructive/10",
      text: "text-destructive",
    },
    3: {
      bg: "bg-warning/10",
      text: "text-warning",
    },
  };
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:auto-cols-max lg:grid-cols-3 gap-4 w-full">
        {cardItem.map((item) => {
          const Icon = item.icon;
          const color = COLOR_MAP[item.id as 1 | 2 | 3];

          return (
            <Card
              key={item.id}
              className="flex items-center gap-4 min-w-60 border-none py-6 px-0 pl-10"
            >
              <CardHeader className="p-0">
                <div
                  className={`${color.bg} p-2 flex items-center justify-center w-12 h-12 rounded`}
                >
                  <Icon className={color.text} />
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <p className={`opacity-60 text-sm`}>{item.title}</p>
                <p className={`${color.text} text-2xl font-bold`}>
                  {item.amount}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-4">
        <Card className="gap-4 min-w-60 border-none py-6 px-5">
          <CardHeader className="border-none m-0 p-0 w-full">
            <h1 className="text-md font-bold mb-2 ">Search Filter</h1>
            <div className="w-full flex justify-between items-center">
              <div>
                <input
                  type="date"
                  className="w-50 px-4 py-2 border border-border rounded-md text-sm"
                />
                <select className="w-50 px-4 py-2 border border-border rounded-md text-sm ml-4">
                  <option value="">Status</option>
                </select>
              </div>
              <div className="flex justify-end items-center">
                <button
                  onClick={() => setOpen(true)}
                  className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
                >
                  <Plus size={18} />
                  Permintaan Cuti
                </button>
              </div>
            </div>
          </CardHeader>
          <div className="">
            {leaveData.length > 0 ? (
              <LeaveRequestTable
                data={leaveData}
                onDelete={(row) => handleDeleteLeave(row)}
                onEdit={(row) => openEditLeave(row)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-16">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Box className="w-8 h-8 text-blue-primary/60" />
                </div>
                <p className="text-lg font-bold text-blue-dark">
                  Belum ada permintaan cuti
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Saat ini tidak ada data pengajuan cuti yang perlu ditinjau.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
      <SideModal
        title={leaveForm ? "Edit Permintaan Cuti" : "Tambah Permintaan Cuti"}
        open={open}
        onClose={() => {
          setOpen(false);
          setLeaveForm(null);
        }}
      >
        <RequestForm
          onCancel={() => {
            setOpen(false);
            setLeaveForm(null);
          }}
          onSubmit={leaveForm ? handleEditLeave : handleAddLeave}
          defaultValue={leaveForm ? [leaveForm] : []}
        />
      </SideModal>
    </Layout>
  );
};

export default LeaveRequestPage;
