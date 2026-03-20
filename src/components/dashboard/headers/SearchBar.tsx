import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="hidden lg:block">
      <form>
        <div className="relative flex justify-center items-center py-2 px-4 border border-border h-11 w-full rounded-lg focus-within:outline-blue-soft/20 focus-within:outline-3">
          <Search size={18} className="text-blue-dark" />
          <input
            type="text"
            placeholder="Search or type command..."
            className="border border-none placeholder:text-blue-dark/40 text-blue-dark focus:outline-none bg-transparent py-2.5 text-sm w-80 h-full ml-2"
          />
        </div>
      </form>
    </div>
  );
};
