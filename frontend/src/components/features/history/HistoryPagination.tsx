import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../common/Button";

type Props = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
};

const HistoryPagination = ({
  currentPage,
  totalPages,
  totalResults,
  startIndex,
  endIndex,
  onPageChange,
}: Props) => {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <p className="text-sm text-secondary">
        Showing {startIndex + 1} to {Math.min(endIndex, totalResults)} of{" "}
        {totalResults}
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-2xl p-2"
        >
          <ChevronLeft size={20} />
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-2xl px-3 py-1 text-sm font-accent uppercase ${
                currentPage === page
                  ? "bg-[#333333] text-white"
                  : "bg-[#E2E2E2] hover:bg-[#D0D0D0]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-2xl p-2"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default HistoryPagination;
