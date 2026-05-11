import type { DocumentResponse } from "../../../types/document";
import Button from "../../common/Button";
import DocumentMenu from "./DocumentMenu";

type Props = {
  doc: DocumentResponse;
  number: number;
  onViewSummary: (id: number, number: number) => void;
  onDelete: (id: number) => void;
};

const DocumentRow = ({ doc, number, onViewSummary, onDelete }: Props) => {
  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  return (
    <div className="grid items-center rounded-base bg-surfaceContainer px-4 py-3 text-sm hover:bg-[#F3F3F4] md:grid-cols-12">
      <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary md:col-span-2">
        {formatDate(doc.created_at)}
      </p>

      <div className="mt-2 text-base text-onBackground md:col-span-6">
        <p className="font-semibold">Document #{number}</p>

        <p className="line-clamp-2 text-xs text-secondary">
          {doc.original_content}
        </p>
      </div>

      <div className="mt-4 flex gap-2 md:col-span-4 md:mt-0 md:grid md:grid-cols-7 md:gap-4">
        <div className="flex items-center md:col-span-2 md:justify-center">
          <span className="w-25 rounded-2xl bg-[#E2E2E2] p-2 text-center font-accent text-[10px] uppercase">
            {doc.category}
          </span>
        </div>

        <Button
          onClick={() => onViewSummary(doc.id, number)}
          variant="primary"
          className="grow rounded-2xl p-4 font-accent text-[10px] uppercase tracking-[0.2em] text-onBackground md:col-span-4"
        >
          View Summary
        </Button>

        <div className="flex items-center justify-center md:col-span-1">
          <DocumentMenu docId={doc.id} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default DocumentRow;
