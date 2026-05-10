import { useState } from "react";
import { Copy } from "lucide-react";
import Button from "./Button";

type Props = {
  selectedSummary: string;
};

export default function CopyButton({ selectedSummary }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedSummary);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={handleCopy}
        className="rounded-full text-sm"
      >
        <Copy size={18} />
      </Button>

      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-md shadow-md">
          Copied!
        </div>
      )}
    </div>
  );
}
