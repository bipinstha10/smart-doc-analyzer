import { useMemo, useState, useEffect, useRef } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import Sidebar from "../components/layout/Sidebar";
import {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useDeleteDocumentMutation,
} from "../services/uploadApi";
import { Menu, X } from "lucide-react";
import CountingCard from "../components/features/history/CountingCard";
import DocumentRow from "../components/features/history/DocumentRow";
import HistoryPagination from "../components/features/history/HistoryPagination";
import SummaryPanel from "../components/features/history/SummaryPanel";

const HistoryPage = () => {
  const [open, setOpen] = useState(false);
  const [query] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [selectedDocNumber, setSelectedDocNumber] = useState<number | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [deleteDocument] = useDeleteDocumentMutation();

  const handleViewSummary = (id: number, number: number) => {
    setSelectedDocId(id);
    setSelectedDocNumber(number);
  };

  const summaryRef = useRef<HTMLDivElement | null>(null);

  const { data: documents, isLoading, isError } = useGetDocumentsQuery();
  const { data: selectedDoc } = useGetDocumentQuery(selectedDocId ?? skipToken);

  const results = useMemo(() => {
    if (!documents) return [];
    const normalizedQuery = query.toLowerCase();
    return documents.filter((doc) => {
      return [doc.category, doc.summary, doc.original_content]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [documents, query]);

  // Calculate Pagination
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  const counts = useMemo(() => {
    return {
      total: documents?.length ?? 0,
      notice: documents?.filter((doc) => doc.category === "notice").length ?? 0,
      feedback:
        documents?.filter((doc) => doc.category === "feedback").length ?? 0,
      complaint:
        documents?.filter((doc) => doc.category === "complaint").length ?? 0,
    };
  }, [documents]);

  const handleDelete = async (id: number) => {
    try {
      await deleteDocument(id).unwrap();

      if (selectedDocId === id) {
        setSelectedDocId(null);
        setSelectedDocNumber(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedDoc) {
      summaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedDoc]);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="md:hidden p-4">
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar wrapper */}
      <div
        className={`
        fixed top-0 left-0 z-50 h-screen w-80
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <Sidebar />

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-8 right-4 md:hidden"
        >
          <X />
        </button>
      </div>

      {/* Overlay (IMPORTANT: OUTSIDE sidebar wrapper) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="bg-white md:ml-80">
        <section className="px-6 py-8 md:px-8">
          <div className="md:px-20 md:ml-20">
            <h1 className="mt-8 text-4xl md:text-5xl font-semibold text-onBackground">
              Archive
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed">
              A centralized record of all document classifications. Our neural
              engine processes each entry for semantic context and intent.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded border-l border-[#474747] bg-white p-2 md:p-5 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
                  Total Processed
                </p>
                <p className="mt-5 text-2xl md:mt-15 md:text-6xl font-semibold text-onBackground">
                  {counts.total}
                </p>
              </div>
              <CountingCard heading="Notice" counts={counts.notice} />
              <CountingCard heading="Feedback" counts={counts.feedback} />
              <CountingCard heading="Complaint" counts={counts.complaint} />
            </div>

            <div className="mt-8 space-y-3">
              {isLoading && (
                <p className="text-sm text-secondary">Loading history...</p>
              )}

              {isError && (
                <p className="text-sm text-red-500">
                  Failed to load document history.
                </p>
              )}

              {!isLoading && !isError && results.length === 0 && (
                <p className="text-sm text-secondary">No documents found.</p>
              )}

              <div>
                {paginatedResults.map((doc) => {
                  const index = results.findIndex((d) => d.id === doc.id);
                  return (
                    <DocumentRow
                      key={doc.id}
                      doc={doc}
                      number={index + 1}
                      onViewSummary={handleViewSummary}
                      onDelete={handleDelete}
                    />
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {results.length > 0 && (
                <HistoryPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={results.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>

            {selectedDocId !== null &&
              selectedDoc &&
              selectedDocNumber !== null && (
                <SummaryPanel
                  document={selectedDoc}
                  number={selectedDocNumber}
                  onClose={() => {
                    setSelectedDocId(null);
                    setSelectedDocNumber(null);
                  }}
                  summaryRef={summaryRef}
                />
              )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;
