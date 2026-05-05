import { FileText } from "lucide-react";

const RecentFilesCard = ({ files }: { files: string[] }) => {
  return (
    <div className="w-full rounded-xl bg-white p-5">
      <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-secondary">
        Recent Samples
      </p>

      {files.length === 0 ? (
        <p className="mt-4 text-sm text-[#474747] text-center py-4">
          No files uploaded yet
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded-base px-3 py-2 text-sm text-[#474747] hover:bg-surfaceHigh transition-colors cursor-pointer truncate"
              title={file}
            >
              <FileText size={16} className="shrink-0" />
              <span className="truncate">{file}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentFilesCard;
