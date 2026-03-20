import { Bell, Moon } from "lucide-react";
import { SearchBar } from "./headers/SearchBar";
import UserMenu from "./headers/UserMenu";

const DashboardHeader = () => {
  return (
    <>
      <header className="sticky top-0 flex w-full bg-white border-border z-99999  lg:border-b">
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-border sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
            <button className="flex items-center justify-center w-10 h-10 text-blue-dark border-border rounded-lg z-99999 lg:h-11 lg:w-11 lg:border">
              <svg
                v-else
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            {/* <HeaderLogo /> */}
            <SearchBar />
          </div>
          <div className=" mr-4">
            <Moon size={20} className="text-blue-dark/40" />
          </div>
          <div className=" mr-4">
            <Bell size={20} className="text-blue-dark/40" />
          </div>
          <UserMenu />
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
