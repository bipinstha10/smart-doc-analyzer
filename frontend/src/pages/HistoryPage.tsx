import { useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import {
  useGetDocumentsQuery,
  useGetDocumentQuery,
} from "../services/uploadApi";

const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  const { data: documents, isLoading, isError } = useGetDocumentsQuery();
  const { data: selectedDoc } = useGetDocumentQuery(selectedDocId ?? 0, {
    skip: selectedDocId === null,
  });

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

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-";

  return (
    <div className="grid min-h-screen md:grid-cols-12 bg-[#F9F9F9]">
      <div className="md:col-span-2">
        <Sidebar />
      </div>

      <div className="md:col-span-10">
        <section className="px-6 py-8 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
              History / All Items
            </p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-full border border-outlineVariant/30 bg-surfaceContainer px-4 py-2 text-sm"
              placeholder="Search archive..."
            />
          </div>

          <div className="md:px-20 md:ml-20">
            <h1 className="mt-8 text-4xl md:text-5xl font-semibold text-onBackground">
              Archive
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed">
              A centralized record of all document classifications. Our neural
              engine processes each entry for semantic context and intent.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded border-l border-[#474747] bg-white p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
                  Total Processed
                </p>
                <p className="mt-5 md:mt-15 text-6xl font-semibold text-onBackground">
                  {counts.total}
                </p>
              </div>
              <div className="rounded bg-[#F3F3F4] p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
                  Notice
                </p>
                <p className="mt-5 md:mt-15 text-5xl font-semibold">
                  {counts.notice}
                </p>
              </div>
              <div className="rounded bg-[#F3F3F4] p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
                  Feedback
                </p>
                <p className="mt-5 md:mt-15 text-5xl font-semibold">
                  {counts.feedback}
                </p>
              </div>
              <div className="rounded bg-[#F3F3F4] p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
                  Complaint
                </p>
                <p className="mt-5 md:mt-15 text-5xl font-semibold">
                  {counts.complaint}
                </p>
              </div>
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

              {results.map((doc) => (
                <div
                  key={doc.id}
                  className="grid md:grid-cols-12 items-center rounded-base bg-surfaceContainer px-4 py-3 text-sm"
                >
                  <p className="md:col-span-1 font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
                    {formatDate(doc.created_at)}
                  </p>
                  <div className="md:col-span-5 text-base text-onBackground mt-2">
                    <p className="font-semibold">Document #{doc.id}</p>
                    <p className="text-xs text-secondary line-clamp-2">
                      {doc.original_content}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 md:col-span-6 md:mt-0 md:grid md:grid-cols-6 md:gap-4">
                    <Button
                      variant="outline"
                      className="md:col-span-3 font-accent text-[10px] uppercase tracking-[0.2em] text-secondary"
                    >
                      {doc.category}
                    </Button>
                    <Button
                      onClick={() => setSelectedDocId(doc.id)}
                      variant="primary"
                      className="md:col-span-3 font-accent text-[10px] uppercase tracking-[0.2em] text-onBackground"
                    >
                      View Summary
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {selectedDoc && (
              <div className="mt-10 rounded-xl bg-white p-6 shadow-md shadow-gray-300/40">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-secondary uppercase tracking-[0.2em]">
                      Selected summary
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-onBackground">
                      Document #{selectedDoc.id}
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDocId(null)}
                    className="text-sm"
                  >
                    Clear
                  </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  <div className="rounded-xl bg-surfaceContainer p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                      Category
                    </p>
                    <p className="mt-2 text-lg font-semibold text-onBackground">
                      {selectedDoc.category}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surfaceContainer p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                      Confidence
                    </p>
                    <p className="mt-2 text-lg font-semibold text-onBackground">
                      {(selectedDoc.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-surfaceContainer p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                      Processed
                    </p>
                    <p className="mt-2 text-lg font-semibold text-onBackground">
                      {formatDate(selectedDoc.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-onBackground">
                      Original Content
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">
                      {selectedDoc.original_content}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-onBackground">
                      Summary
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">
                      {selectedDoc.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;
