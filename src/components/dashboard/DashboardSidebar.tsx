import {
  CalendarClock,
  DollarSign,
  HeartPulse,
  Home,
  Radio,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState("");
  const menuItems = [
    {
      href: "/admin/dashboard",
      icon: <Home />,
      name: "Dashboard",
    },
    {
      href: "/admin/management",
      icon: <Users />,
      name: "Management",
    },
    {
      href: "/admin/jadwal-shift",
      icon: <CalendarClock />,
      name: "Jadwal Shift",
    },
    {
      href: "/admin/izin",
      icon: <Radio />,
      name: "Permintaan Izin",
    },
    {
      href: "/admin/gaji",
      icon: <DollarSign />,
      name: "Gaji Karyawan",
    },
  ];

  //   useEffect(() => {
  //     setIsOpen(isActive);
  //   }, [isActive]);

  return (
    <div className="flex flex-col h-full p-6  bg-accent-foreground">
      {/* top */}
      <div className="flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl auth-gradient shadow-lg">
          <HeartPulse
            className="h-6 w-6 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
        <h1 className="text-lg font-bold text-foreground">MediStaff</h1>
      </div>
      {/* main */}
      <div>
        <ul className="flex flex-col gap-2 mt-10">
          {menuItems.map((item, index) => {
            const logo = item.icon;
            return (
              <li key={index} className="mb-2">
                <Link
                  to={item.href}
                  className="flex p-2 rounded-lg items-center gap-2 text-sm font-medium text-blue-dark/60 hover:text-blue-dark transition hover:bg-background"
                >
                  {logo}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DashboardSidebar;
