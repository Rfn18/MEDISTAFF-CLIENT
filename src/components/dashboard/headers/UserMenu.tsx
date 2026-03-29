import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ChevronDownIcon,
  InfoIcon,
  LogOutIcon,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

export default function UserMenu() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userRole = user?.role_id;
  const profileUrl =
    userRole === 2 || userRole === 1 ? "/admin/profil" : "/staff/profil";

  const menuItems = [
    { href: profileUrl, icon: UserCircleIcon, text: "profil" },
    { href: "#", icon: SettingsIcon, text: "Settings" },
    { href: "#", icon: InfoIcon, text: "Support" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const signOut = async () => {
    try {
      await api.post(`/logout`);
      await logout();
      navigate("/login");
      closeDropdown();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const employeeName = user?.employee?.full_name || user?.name || "User";
  const userPhoto = user?.employee?.photo
    ? `${baseUrl}/storage/employee/${user.employee.photo}`
    : "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(employeeName) +
      "&background=cce3de&color=03045e";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-blue-dark text-sm cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border border-border">
          <img
            src={userPhoto}
            alt="User"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(employeeName) +
                "&background=cce3de&color=03045e";
            }}
          />
        </span>

        <span className="block mr-1 font-semibold text-blue-dark max-w-[150px] truncate">
          {employeeName}
        </span>

        <ChevronDownIcon
          size={18}
          className={`transition-transform ${dropdownOpen ? "rotate-180" : ""} text-blue-dark/60 ml-1`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4.5 flex w-[260px] flex-col rounded-2xl border border-border bg-white p-3 shadow-lg z-50">
          <div className="px-2 pt-1 pb-3 overflow-hidden">
            <span className="block font-bold text-blue-dark text-base truncate">
              {employeeName}
            </span>
            <span className="block mt-0.5 text-muted-foreground text-sm truncate">
              {user?.email || "No Email"}
            </span>
          </div>

          <ul className="flex flex-col gap-1 pt-3 pb-3 border-t border-b border-border/60 text-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text}>
                  <Link
                    to={item.href}
                    onClick={closeDropdown}
                    className="flex items-center gap-3 px-3 py-2.5 font-semibold text-blue-dark rounded-xl group text-sm hover:bg-slate-50 transition-colors"
                  >
                    <Icon
                      className="text-muted-foreground group-hover:text-blue-primary transition-colors"
                      size={18}
                    />
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 mt-2 font-semibold text-red-600 rounded-xl group text-sm hover:bg-red-50/50 hover:cursor-pointer transition-colors"
          >
            <LogOutIcon
              className="text-red-400 group-hover:text-red-500 transition-colors"
              size={18}
            />
            Keluar
          </div>
        </div>
      )}
    </div>
  );
}
