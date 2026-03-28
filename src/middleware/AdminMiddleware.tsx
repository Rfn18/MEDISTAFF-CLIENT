import { Navigate, Outlet } from "react-router-dom";

export default function AdminMiddleware() {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const authDatas = JSON.parse(auth!).datas;

  if (authDatas.user.role_id !== 2) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
