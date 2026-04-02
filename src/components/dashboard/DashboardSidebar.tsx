import {
  CalendarClock,
  DollarSign,
  HeartPulse,
  Home,
  Radio,
  Users,
  ChevronDown,
  ClockCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLayout } from "../../context/LayoutContext";

const DashboardSidebar = () => {
  const { isSidebarOpen } = useLayout();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useAuth();
  const userRole = user?.role_id;
  const menuItems =
    userRole === 2
      ? [
          {
            name: "Dashboard",
            icon: <Home size={20} />,
            href: "/admin/dashboard",
          },
          {
            name: "Management",
            icon: <Users size={20} />,
            href: "/admin/management",
          },

          {
            name: "Persetujuan Cuti",
            icon: <Radio size={20} />,
            href: "/admin/persetujuan-cuti",
          },
          {
            name: "Jadwal Shift",
            icon: <CalendarClock size={20} />,
            subItems: [
              { name: "List Jadwal", href: "/admin/jadwal-shift" },
              { name: "Request Jadwal", href: "/admin/request-shift" },
            ],
          },
          {
            name: "Absensi",
            icon: <ClockCheck size={20} />,
            subItems: [
              { name: "List Absensi", href: "/admin/absensi" },
              { name: "Scan Absensi", href: "/admin/scan-absensi" },
            ],
          },
          {
            name: "Gaji Karyawan",
            icon: <DollarSign size={20} />,
            subItems: [
              { name: "List Gaji", href: "/admin/gaji" },
              { name: "Komponen Gaji", href: "/admin/komponen-gaji" },
            ],
          },
        ]
      : [
          {
            name: "Dashboard",
            icon: <Home size={20} />,
            href: "/staff/dashboard",
          },
          {
            name: "Jadwal Shift",
            icon: <CalendarClock size={20} />,
            subItems: [
              { name: "List Jadwal", href: "/staff/jadwal-shift" },
              { name: "Request Jadwal", href: "/staff/request-shift" },
            ],
          },
          {
            name: "Pengajuan Cuti",
            icon: <Radio size={20} />,
            href: "/staff/pengajuan-cuti",
          },
          {
            name: "Absensi",
            icon: <ClockCheck size={20} />,
            href: "/staff/absensi",
          },
          {
            name: "Gaji Saya",
            icon: <DollarSign size={20} />,
            href: "/staff/gaji",
          },
        ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`flex flex-col h-full bg-accent-foreground transition-all duration-300 ease-in-out overflow-hidden ${
        isSidebarOpen ? "w-60 p-6" : "w-23 p-6"
      }`}
    >
      <div className="flex items-center gap-3 min-w-max">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl auth-gradient shadow-lg">
          <HeartPulse
            className="h-6 w-6 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
        <h1
          className={`text-lg font-bold text-foreground transition-all duration-300 origin-left ${
            isSidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0"
          }`}
        >
          MediStaff
        </h1>
      </div>

      {/* Menu Section */}
      <div className="mt-10 overflow-y-auto no-scrollbar overflow-hidden">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <li key={index} className="min-w-max">
              {item.subItems ? (
                <div className="flex flex-col">
                  <button
                    onClick={() =>
                      isSidebarOpen &&
                      setOpenMenu(openMenu === item.name ? null : item.name)
                    }
                    className={`flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href || "")
                        ? "bg-primary/20 text-blue-dark"
                        : "text-blue-dark/60 hover:bg-background w-full"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="shrink-0">{item.icon}</span>
                      <span
                        className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}
                      >
                        {item.name}
                      </span>
                    </div>
                    {isSidebarOpen && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${openMenu === item.name ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenu === item.name && isSidebarOpen ? "max-h-40 mt-2" : "max-h-0"} `}
                  >
                    <ul className="ml-9 flex flex-col gap-1 border-l-2 border-primary/10 pl-2">
                      {item.subItems.map((sub, i) => (
                        <li key={i}>
                          <Link
                            to={sub.href}
                            className={`block p-2 rounded-md text-sm transition-colors ${isActive(sub.href) ? "text-primary font-semibold" : "text-blue-dark/60 hover:text-blue-dark"}`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-primary/20 text-blue-dark"
                      : "text-blue-dark/60 hover:bg-background"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span
                    className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0 "}`}
                  >
                    {item.name}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardSidebar;
