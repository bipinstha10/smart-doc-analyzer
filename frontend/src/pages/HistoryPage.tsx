import { useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";

const mockItems = [
  "Contract_2026.pdf",
  "Feedback_Form.docx",
  "Invoice_Q1.xlsx",
  "Policy_Update.pdf",
];
const HistoryPage = () => {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      mockItems.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="grid min-h-screen md:grid-cols-12 bg-[#F9F9F9]">
      <div className="md:col-span-2">
        <Sidebar />
      </div>

      <div className="md:col-span-10">
        <section className="px-6 py-8 md:px-8">
          <div className="flex items-center justify-between">
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
                  1,284
                </p>
              </div>
              <div className="rounded bg-[#F3F3F4] p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
                  Notice
                </p>
                <p className="mt-5 md:mt-15 text-5xl font-semibold">412</p>
              </div>
              <div className="rounded bg-[#F3F3F4] p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
                  Feedback
                </p>
                <p className="mt-5 md:mt-15 text-5xl font-semibold">658</p>
              </div>
              <div className="rounded bg-[#F3F3F4] p-6 md:p-10 shadow-md shadow-gray-300/40">
                <p className="font-accent text-[10px] uppercase tracking-[0.2em]">
                  Complaint
                </p>
                <p className="mt-5 md:mt-15 text-5xl font-semibold">214</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {results.map((item, idx) => (
                <div
                  key={item}
                  className="grid md:grid-cols-12 items-center rounded-base bg-surfaceContainer px-4 py-3 text-sm"
                >
                  <p className="md:col-span-1 font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
                    Oct {24 - idx}
                  </p>
                  <p className="md:col-span-5 text-base text-onBackground mt-2">
                    {item}
                  </p>
                  <div className="flex justify-between mt-2 md:grid md:grid-cols-6 md:gap-20">
                    <Button
                      variant="outline"
                      className="md:col-span-3 font-accent text-[10px] uppercase tracking-[0.2em] text-secondary"
                    >
                      {idx % 2 ? "Feedback" : "Complaint"}
                    </Button>
                    <Button
                      variant="primary"
                      className="md:col-span-3 font-accent text-[10px] uppercase tracking-[0.2em] text-onBackground"
                    >
                      Summarize
                    </Button>
                  </div>
                </div>
              ))}
              {results.length === 0 && (
                <p className="text-sm text-secondary">
                  No matching files found.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;
