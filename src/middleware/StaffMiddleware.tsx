import { Navigate, Outlet } from "react-router-dom";

export default function StaffMiddleware() {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const authDatas = JSON.parse(auth!);

  if (authDatas.role.is_admin === 1) {
    return <Navigate to="/unauthorized" replace />;
  } 

  return <Outlet />;
}
