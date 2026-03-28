import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedMiddleware() {
  const auth = localStorage.getItem("auth");
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
