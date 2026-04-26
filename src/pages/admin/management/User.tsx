import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { UserTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import type { User } from "../../../types/userType";
import axios from "axios";
import UserForm from "../../../components/form/admin/UserForm";
import { Loading } from "../../../components/ui/load";
import api from "../../../services/api";
import { Paginate } from "../../../components/ui/paginate";

export default function UserPage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [userForm, setUserForm] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [paginateLoading, setPaginateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginateData, setPaginateData] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [totalData, setTotalData] = useState(0);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setPaginateLoading(true);
      const response = await api.get(
        `/users?page=${paginateData.current_page}`,
      );
      const data = response.data.data.datas.data;
      setUserData(data);
      setTotalData(response.data.data.datas.total);
      setPaginateData({
        current_page: response.data.data.datas.current_page,
        last_page: response.data.data.datas.last_page,
      });
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
      setPaginateLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [paginateData.current_page]);

  const handleAddUser = async (data: User) => {
    setUserForm(data);

    try {
      setLoading(true);
      await api.post(`/users`, data);
      setUserForm(null);
      fetchUser();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setUserForm(null);
      setLoading(false);
      setOpen(false);
    }
  };

  const handleInactivateUser = async (row: User) => {
    try {
      setLoading(true);
      await api.delete(`/users/${row.id}`);
      fetchUser();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditUser = (row: User) => {
    setUserForm(row);
    setOpen(true);
  };

  const handleUpdateUser = async (data: User) => {
    try {
      setLoading(true);
      await api.post(`/users/${userForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchUser();
      setUserForm(null);
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
            <div>
              <select className="w-50 px-4 py-2 border border-border rounded-md text-sm">
                <option value="">last login</option>
              </select>
              <select className="w-50 px-4 py-2 border border-border rounded-md text-sm ml-4">
                <option value="">role</option>
              </select>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex w-50 border-border border rounded-md px-4 py-2">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Cari user..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah User
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          {loading ? (
            <Loading message="loading data..." />
          ) : (
            <UserTable
              data={userData}
              onEdit={(row) => openEditUser(row)}
              onDelete={(row) => handleInactivateUser(row)}
            />
          )}
        </div>
        <Paginate
          data={userData}
          totalData={totalData}
          paginateData={paginateData}
          setPaginateData={setPaginateData}
          paginateLoading={paginateLoading}
        />
      </Card>

      <SideModal
        title={userForm ? "Edit User" : "Add User"}
        open={open}
        onClose={() => {
          setOpen(false);
          setUserForm(null);
        }}
      >
        <UserForm
          onCancel={() => {
            setOpen(false);
            setUserForm(null);
          }}
          onSubmit={userForm ? handleUpdateUser : handleAddUser}
          defaultValue={userForm ? [userForm] : []}
        />
      </SideModal>
    </>
  );
}
