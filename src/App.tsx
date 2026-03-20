import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/LoginPage";
import { Register } from "./pages/auth/RegisterPage";
import Dashboard from "./pages/admin/DashboardPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
