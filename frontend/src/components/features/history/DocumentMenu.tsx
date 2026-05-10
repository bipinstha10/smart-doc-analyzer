import { useState } from "react";
import { EllipsisVertical } from "lucide-react";

type Props = {
  docId: number;
  onDelete: (id: number) => void;
};

const DocumentMenu = ({ docId, onDelete }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-full p-1 hover:bg-gray-200"
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 -top-15 z-20 w-36 overflow-hidden rounded-xl bg-white shadow-lg">
          <button
            onClick={() => {
              onDelete(docId);
              setOpen(false);
            }}
            className="w-full cursor-pointer px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentMenu;
