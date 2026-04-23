import { ChevronLeft, ChevronRight } from "lucide-react";

export const Paginate = ({
  data,
  totalData,
  paginateData,
  setPaginateData,
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
}) => {
  return (
    <div className="flex mt-2 justify-between items-center">
      <p className="text-xs">
        menampilkan <span>{data.length}</span> dari <span>{totalData}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={paginateData.current_page === 1}
          onClick={() =>
            setPaginateData((prev) => ({
              ...prev,
              current_page: prev.current_page - 1,
            }))
          }
          className="border border-border p-2 rounded-md text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-border/40 transition"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <div className="flex gap-2">
          {Array.from({ length: paginateData.last_page }, (_, i) =>
            i + 1 === paginateData.current_page ? (
              <p
                key={i}
                className="border border-border p-2 rounded-md w-8 h-8 flex items-center justify-center bg-primary text-white"
              >
                {i + 1}
              </p>
            ) : (
              <button
                key={i}
                className="border border-border p-2 rounded-md w-8 h-8 flex items-center justify-center"
              >
                {i + 1}
              </button>
            ),
          )}
        </div>
        <button
          disabled={paginateData.current_page === paginateData.last_page}
          onClick={() =>
            setPaginateData((prev) => ({
              ...prev,
              current_page: prev.current_page + 1,
            }))
          }
          className="border border-border p-2 rounded-md text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-border/40 transition"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
