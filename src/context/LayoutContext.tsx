import { createContext, useContext, useState } from "react";

type LayoutContextProps = {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsMobile: (isMobile: boolean) => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <LayoutContext.Provider
      value={{ isMobile, isSidebarOpen, setIsSidebarOpen, setIsMobile }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
};
