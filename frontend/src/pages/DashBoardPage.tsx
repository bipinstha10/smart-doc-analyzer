import { useState, useRef } from "react";
import FileUpload from "../components/features/FileUpload";
import Sidebar from "../components/layout/Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import StatisticsCard from "../components/features/StatisticsCard";
import RecentFilesCard from "../components/features/RecentFilesCard";

const DashboardPage = () => {
  const fileUploadRef = useRef<HTMLDivElement>(null);

  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  const scoreData = useSelector((state: RootState) => state.score.data);

  // Add file to recent files
  const handleFileAdded = (fileName: string) => {
    setRecentFiles((prev) => [fileName, ...prev.slice(0, 4)]);
  };

  // Update statistics when Redux data changes
  const allScores = scoreData?.all_scores ?? {
    notice: 0,
    feedback: 0,
    complaint: 0,
  };

  const statistics = [
    {
      label: "Notices",
      percentage: Math.round(allScores.notice || 0),
    },
    {
      label: "Feedback",
      percentage: Math.round(allScores.feedback || 0),
    },
    {
      label: "Complaints",
      percentage: Math.round(allScores.complaint || 0),
    },
  ];

  return (
    <div className="grid min-h-screen md:grid-cols-12">
      <div className="md:col-span-2">
        <Sidebar />
      </div>

      <main className="md:col-span-6 md:mx-40">
        <Content fileUploadRef={fileUploadRef} onFileAdded={handleFileAdded} />
      </main>

      <div className="md:col-span-4 flex flex-col gap-5 justify-center items-center md:w-sm px-8">
        <StatisticsCard statistics={statistics} />
        <RecentFilesCard files={recentFiles} />
      </div>
    </div>
  );
};

export default DashboardPage;

// ================= HEADER =================
const Header = () => {
  return (
    <>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-onBackground md:text-5xl">
        Classify anything.
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-[#474747]">
        Upload your business documents or paste raw text. Our neural engine
        identifies intent and routes them into categorized workflows instantly.
      </p>
    </>
  );
};

// ================= CONTENT =================
type ContentProps = {
  fileUploadRef: React.RefObject<HTMLDivElement | null>;
  onFileAdded: (fileName: string) => void;
};

const Content = ({ fileUploadRef }: ContentProps) => {
  return (
    <div className="md:mt-20">
      <Header />
      <FileUpload ref={fileUploadRef} />
    </div>
  );
};
