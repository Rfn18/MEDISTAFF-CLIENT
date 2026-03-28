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

const DashboardSidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useAuth();
  const userRole = user?.role_id;
  console.log(userRole);

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
            href: "/admin/gaji",
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
        ];

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-accent-foreground">
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl auth-gradient shadow-lg">
          <HeartPulse
            className="h-6 w-6 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
        <h1 className="text-lg font-bold text-foreground">MediStaff</h1>
      </div>
      <div className="mt-10">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="flex items-center justify-between w-full p-2 rounded-lg text-sm font-medium text-blue-dark/60 hover:text-blue-dark transition hover:bg-background hover:cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </div>

                    <ChevronDown
                      size={16}
                      className={`transition ${
                        openMenu === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMenu === item.name && (
                    <ul className="ml-7 mt-2 flex flex-col gap-1">
                      {item.subItems.map((sub, i) => (
                        <li key={i}>
                          <Link
                            to={sub.href}
                            className={`block p-2 rounded-md text-sm transition ${
                              isActive(sub.href)
                                ? "opacity-100 bg-primary/20"
                                : "text-blue-dark/60 hover:text-blue-dark hover:bg-background"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition ${
                    isActive(item.href)
                      ? "opacity-100 bg-primary/20"
                      : "text-blue-dark/60 hover:text-blue-dark hover:bg-background"
                  }`}
                >
                  {item.icon}
                  {item.name}
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
