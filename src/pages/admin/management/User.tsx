import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { UserTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/sideModal";
import type { User } from "../../../types/userType";
import axios from "axios";
import UserForm from "../../../components/form/UserForm";

export default function UserPage() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [userForm, setUserForm] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/users`);
      const data = response.data.data.datas.data;
      setUserData(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleAddUser = async (data: User) => {
    setUserForm(data);

    try {
      await axios.post(`${baseUrl}/api/users`, data);
      setUserForm(null);
      fetchUser();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleInactivateUser = async (row: User) => {
    const newStatus = row.is_active === 1 ? 0 : 1;
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/${row.id}/status`,
        {
          is_active: newStatus,
          _method: "PUT",
        },
      );
      console.log(response);
      fetchUser();
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  const openEditUser = (row: User) => {
    setUserForm(row);
    setOpen(true);
  };

  const handleUpdateUser = async (data: User) => {
    try {
      await axios.post(`${baseUrl}/api/users/${userForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchUser();
      setUserForm(null);
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
          <UserTable
            data={userData}
            onEdit={(row) => openEditUser(row)}
            onDelete={(row) => handleInactivateUser(row)}
          />
        </div>
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
