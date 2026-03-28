import { Navigate, Outlet } from "react-router-dom";

export default function StaffMiddleware() {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const authDatas = JSON.parse(auth!).datas;

  if (authDatas.user.role_id !== 3) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
