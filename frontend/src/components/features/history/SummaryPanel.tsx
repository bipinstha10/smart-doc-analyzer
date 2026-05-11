import type { RefObject } from "react";
import { X } from "lucide-react";
import Button from "../../common/Button";
import type { DocumentResponse } from "../../../types/document";
import CopyButton from "../../common/CopyButton";

type Props = {
  document: DocumentResponse;
  number: number;
  onClose: () => void;
  summaryRef: RefObject<HTMLDivElement | null>;
};
const SummaryPanel = ({ document, number, onClose, summaryRef }: Props) => {
  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  return (
    <div
      ref={summaryRef}
      className="mt-10 rounded-xl bg-white p-6 shadow-md shadow-gray-300/40"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-secondary uppercase tracking-[0.2em]">
            Selected summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-onBackground">
            Document #{number}
          </h2>
        </div>
        <Button
          variant="primary"
          onClick={onClose}
          className="text-sm rounded-full"
        >
          <X />
        </Button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-surfaceContainer p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">
            Category
          </p>
          <p className="mt-2 text-lg font-semibold text-onBackground">
            {document.category}
          </p>
        </div>
        <div className="rounded-xl bg-surfaceContainer p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">
            Confidence
          </p>
          <p className="mt-2 text-lg font-semibold text-onBackground">
            {(document.confidence_score * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl bg-surfaceContainer p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">
            Processed
          </p>
          <p className="mt-2 text-lg font-semibold text-onBackground">
            {formatDate(document.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-onBackground">
            Original Content
          </p>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {document.original_content}
          </p>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold text-onBackground">Summary</p>
            <CopyButton selectedSummary={document.summary} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {document.summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
