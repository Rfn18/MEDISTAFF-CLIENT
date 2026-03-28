import { Plus, Search } from "lucide-react";
import { Card, CardHeader } from "../../../components/ui/card";
import { useEffect, useState } from "react";
import { RoleTable } from "../../../components/dashboard/ManagementDashboard";
import SideModal from "../../../components/ui/Modal";
import type { Role } from "../../../types/userType";
import axios from "axios";
import RoleForm from "../../../components/form/admin/RoleForm";

export default function Role() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [open, setOpen] = useState(false);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [roleForm, setRoleForm] = useState<Role | null>(null);

  const fetchRole = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/roles`);
      const data = response.data.data.datas.data;
      setRoleData(data);
    } catch (error) {
      console.error("fething data error", error);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const handleAddRole = async (data: Role) => {
    setRoleForm(data);

    try {
      await axios.post(`${baseUrl}/api/roles`, data);
      setRoleForm(null);
      fetchRole();
    } catch (error) {
      console.error("fething data error", error);
    } finally {
      setOpen(false);
    }
  };

  const handleDeleteRole = async (row: Role) => {
    try {
      await axios.delete(`${baseUrl}/api/roles/${row.id}`);
      fetchRole();
    } catch (error) {
      console.error("delete error", error);
    }
  };

  const openEditRole = (row: Role) => {
    setRoleForm(row);
    setOpen(true);
  };

  const handleUpdateRole = async (data: Role) => {
    try {
      await axios.post(`${baseUrl}/api/roles/${roleForm?.id}`, {
        ...data,
        _method: "PUT",
      });

      fetchRole();
      setRoleForm(null);
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
                  placeholder="Cari role..."
                  className="w-full h-full focus:outline-none ml-2 text-sm"
                />
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex text-sm auth-gradient opacity-60 hover:opacity-100 transition text-white items-center gap-2 px-4 py-2 rounded-md ml-4 cursor-pointer"
              >
                <Plus size={18} />
                Tambah Role
              </button>
            </div>
          </div>
        </CardHeader>
        <div>
          <RoleTable
            data={roleData}
            onEdit={(row) => openEditRole(row)}
            onDelete={(row) => handleDeleteRole(row)}
          />
        </div>
      </Card>

      <SideModal
        title={roleForm ? "Edit Role" : "Add Role"}
        open={open}
        onClose={() => {
          setOpen(false);
          setRoleForm(null);
        }}
      >
        <RoleForm
          onCancel={() => {
            setOpen(false);
            setRoleForm(null);
          }}
          onSubmit={roleForm ? handleUpdateRole : handleAddRole}
          defaultValue={roleForm ? [roleForm] : []}
        />
      </SideModal>
    </>
  );
}
