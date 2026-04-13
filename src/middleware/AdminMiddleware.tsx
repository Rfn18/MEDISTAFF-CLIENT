import { Navigate, Outlet } from "react-router-dom";

export default function AdminMiddleware() {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const authDatas = JSON.parse(auth!);

  if (authDatas.role.is_admin === 0) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
