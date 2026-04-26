import { Search, Vault } from "lucide-react";
import { CenterModal } from "./Modal";
import { Paginate } from "./paginate";
import { useState } from "react";
import { Loading } from "./load";

export const SelectListModal = ({
  title,
  data,
  onSelect,
  open,
  onClose,
  getId,
  getTitle,
  getDescription,
  renderItem,
  totalData,
  setSearchValue,
  paginateData = 1,
  setPaginateData,
  loading,
}: {
  title: string;
  data: any[];
  onSelect: (item: any) => void;
  open: boolean;
  onClose: () => void;
  getId: (item: any) => string;
  getTitle: (item: any) => string;
  getDescription?: (item: any) => string;
  renderItem?: (item: any) => React.ReactNode;
  setSearchValue: (value: string) => void;
  paginateData: any;
  setPaginateData: (data: any) => void;
  totalData: number;
  loading?: boolean;
}) => {
  if (!open) return null;
  const [value, setValue] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setValue(e.target.value);
    setPaginateData((prev: any) => ({ ...prev, current_page: 1 }));
  };
  
  return (
    <CenterModal open={open} onClose={onClose} title={title}>
      <div>
        <div className="sticky bg-background top-20 flex items-center py-2 px-4 border border-border h-11 w-full rounded-lg focus-within:outline-blue-soft/20 focus-within:outline-3">
          <Search size={18} className="text-blue-dark" />
          <input
            value={value}
            onChange={handleSearch}
            type="text"
            placeholder="Search employee..."
            className="w-full h-full border border-none placeholder:text-blue-dark/40 text-blue-dark focus:outline-none bg-transparent py-2.5 text-sm ml-2"
          />
        </div>
        {loading ? (
          <div className="w-full h-full">
            <Loading message="Sistem loading..." />
          </div>
        ) : (
          <div className="grid grid-cols-3 mt-4 max-h-60 overflow-hidden">
            <>
              {renderItem
                ? data.map((item) => (
                    <div
                      key={getId(item)}
                      onClick={() => onSelect(item)}
                      className="p-2 rounded-lg hover:bg-blue-soft cursor-pointer"
                    >
                      {renderItem(item)}
                    </div>
                  ))
                : data.map((item) => (
                    <div
                      key={getId(item)}
                      onClick={() => onSelect(item)}
                      className="p-2 rounded-lg hover:bg-blue-soft cursor-pointer overflow-hidden"
                    >
                      <h1 className="text-blue-dark text-sm font-bold">
                        {getTitle(item)}
                      </h1>
                      {getDescription && (
                        <p className="text-sm text-blue-dark/60">
                          {getDescription(item)}
                        </p>
                      )}
                    </div>
                  ))}
            </>
          </div>
        )}
        <div className="sticky bottom-2">
          {!loading && data.length >= 10 && (
            <Paginate
              data={data}
              totalData={totalData}
              paginateData={paginateData}
              setPaginateData={setPaginateData}
            />
          )}
        </div>
      </div>
    </CenterModal>
  );
};
