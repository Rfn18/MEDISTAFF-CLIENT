import { Search } from "lucide-react";
import { Card, CardHeader } from "./card";
import { CenterModal } from "./Modal";

export const SelectListModal = ({
  title,
  data,
  onSelect,
  open,
  onClose,
}: {
  title: string;
  data: any[];
  onSelect: (item: { id: string; name: string }) => void;
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;

  return (
    <CenterModal open={open} onClose={onClose} title={title}>
      <div>
        <div className="relative flex items-center py-2 px-4 border border-border h-11 w-full rounded-lg focus-within:outline-blue-soft/20 focus-within:outline-3">
          <Search size={18} className="text-blue-dark" />
          <input
            type="text"
            placeholder="Search employee..."
            className="border border-none placeholder:text-blue-dark/40 text-blue-dark focus:outline-none bg-transparent py-2.5 text-sm w-80 h-full ml-2"
          />
        </div>
        <div className="grid grid-cols-2 mt-4 max-h-60 overflow-y-auto">
          {data.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-lg hover:bg-blue-soft cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <h1 className="text-blue-dark text-md font-bold">{item.name}</h1>
              <p className="text-sm text-blue-dark/60">ID: {item.id}</p>
            </div>
          ))}
        </div>
      </div>
    </CenterModal>
  );
};
