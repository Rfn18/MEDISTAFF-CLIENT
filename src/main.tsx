import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LayoutProvider } from "./context/LayoutContext.tsx";

createRoot(document.getElementById("root")!).render(
  <LayoutProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </LayoutProvider>,
);
