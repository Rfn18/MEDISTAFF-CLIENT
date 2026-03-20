import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ChevronDownIcon,
  InfoIcon,
  LogOutIcon,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const menuItems = [
    { href: "/profile", icon: UserCircleIcon, text: "Edit profil" },
    { href: "/profile", icon: SettingsIcon, text: "Settings" },
    { href: "/profile", icon: InfoIcon, text: "Support" },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const signOut = () => {
    console.log("Signing out...");
    closeDropdown();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-blue-dark text-sm cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="/img/FasterinoFormal.png" alt="User" />
        </span>

        <span className="block mr-1 font-medium text-blue-dark">Fasterino</span>

        <ChevronDownIcon
          size={18}
          className={`transition-transform ${dropdownOpen ? "rotate-180" : ""} text-blue-dark`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4.25 flex w-65 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-md">
          <div>
            <span className="block font-medium text-blue-dark text-sm">
              Fasterino Rafael
            </span>
            <span className="mt-0.5 block text-blue-dark/60 text-sm">
              rinofaster89@gmail.com
            </span>
          </div>

          <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-border text-sm ">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2 font-medium text-blue-dark rounded-lg group text-sm hover:bg-background "
                  >
                    <Icon
                      className="text-blue-dark/60 group-hover:text-blue-dark"
                      size={18}
                    />
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            to="/signin"
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-blue-dark rounded-lg group text-sm hover:bg-background"
          >
            <LogOutIcon
              className="text-blue-dark/60 group-hover:text-blue-dark"
              size={18}
            />
            Sign out
          </Link>
        </div>
      )}
    </div>
  );
}
