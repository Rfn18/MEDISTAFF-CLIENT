import type { ReactNode } from "react";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardSidebar from "../dashboard/DashboardSidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-blue-dark ">
      <aside className="fixed top-0 left-0 h-screen w-70 border-r border-border text-blue-dark">
        <DashboardSidebar />
      </aside>

      <div className="flex flex-col flex-1 ml-70 min-h-screen">
        <header className="sticky top-0 w-full z-50 border-border bg-background">
          <DashboardHeader />
        </header>

        <div className="flex-1">
          <main className="p-6 min-h-[calc(100vh-120px)]">{children}</main>

          <footer className="border-t border-border bg-background p-4 text-sm text-blue-dark/60">
            © {new Date().getFullYear()} MediStaff. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
