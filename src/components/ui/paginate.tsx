import { ChevronLeft, ChevronRight } from "lucide-react";
import getPagination from "../../utils/getPagination";

export const Paginate = ({
  data,
  totalData,
  paginateData,
  setPaginateData,
  paginateLoading,
}: {
  data: any[];
  totalData: number;
  paginateData: {
    current_page: number;
    last_page: number;
  };
  setPaginateData: React.Dispatch<
    React.SetStateAction<{
      current_page: number;
      last_page: number;
    }>
  >;
  paginateLoading: boolean;
}) => {
  const pages = getPagination(
    paginateData.current_page,
    paginateData.last_page,
  );
  return (
    <div className="flex mt-2 justify-between items-center">
      <p className="text-xs">
        menampilkan <span>{data.length}</span> dari <span>{totalData}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={paginateData.current_page === 1 || paginateLoading}
          onClick={() =>
            setPaginateData((prev) => ({
              ...prev,
              current_page: prev.current_page - 1,
            }))
          }
          className={
            paginateLoading
              ? "border border-border cursor-not-allowed p-2 rounded-md text-xs flex items-center justify-center gap-2 hover:bg-border/40 transition opacity-50"
              : "border border-border p-2 rounded-md text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-border/40 transition"
          }
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <div className="flex gap-2">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 flex items-center">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() =>
                  setPaginateData((prev) => ({
                    ...prev,
                    current_page: Number(page),
                  }))
                }
                disabled={page === paginateData.current_page}
                className={
                  page === paginateData.current_page
                    ? "bg-primary text-white w-8 h-8 rounded-md"
                    : "border cursor-pointer border-border w-8 h-8 rounded-md"
                }
              >
                {page}
              </button>
            ),
          )}
        </div>
        <button
          disabled={
            paginateData.current_page === paginateData.last_page ||
            paginateLoading
          }
          onClick={() =>
            setPaginateData((prev) => ({
              ...prev,
              current_page: prev.current_page + 1,
            }))
          }
          className={
            paginateLoading
              ? "border border-border cursor-not-allowed p-2 rounded-md text-xs flex items-center justify-center gap-2 hover:bg-border/40 transition opacity-50"
              : "border border-border p-2 rounded-md text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-border/40 transition"
          }
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
