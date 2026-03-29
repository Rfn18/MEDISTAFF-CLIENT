import { useEffect, type ReactNode } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardSidebar from "../dashboard/DashboardSidebar";
import { useLayout } from "../../context/LayoutContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSidebarOpen, isMobile, setIsMobile, setIsSidebarOpen } =
    useLayout();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  const handleContentClick = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen bg-background text-blue-dark">
        <aside
          className={`fixed top-0 left-0 h-screen border-r border-border text-blue-dark z-[70] bg-accent-foreground transition-all duration-300 ease-in-out 
          ${
            isMobile
              ? isSidebarOpen
                ? "translate-x-0 w-64 shadow-2xl"
                : "-translate-x-full w-64"
              : isSidebarOpen
                ? "w-64 translate-x-0"
                : "w-20 translate-x-0"
          }`}
        >
          <DashboardSidebar />
        </aside>

        <div
          className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
            isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <header className="sticky top-0 w-full z-50 border-border bg-background">
            <DashboardHeader />
          </header>

          <div className="flex-1">
            <main
              className="p-6 min-h-[calc(100vh-120px)]"
              onClick={handleContentClick}
            >
              {children}
            </main>

            <footer className="border-t border-border bg-background p-4 text-sm text-blue-dark/60">
              © {new Date().getFullYear()} MediStaff. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
