import React, { useState, forwardRef } from "react";
import {
  Upload,
  File,
  X,
  CheckCircle,
  FileText,
  AlignLeft,
  Type,
} from "lucide-react";
import Button from "./Button";
import {
  usePostDocumentMutation,
  usePostTextMutation,
} from "../services/uploadApi";
import ScoresComponent from "./ScoresComponent";

const FileUpload = forwardRef<HTMLDivElement>((_, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"file" | "text">("file");
  const [textInput, setTextInput] = useState("");

  const [postDocument, { isLoading, isError, isSuccess, error, reset }] =
    usePostDocumentMutation();

  const [
    postText,
    {
      isLoading: isTextLoading,
      isError: isTextError,
      isSuccess: isTextSuccess,
      error: textError,
      reset: resetText,
    },
  ] = usePostTextMutation();

  const [result, setResult] = useState<{
    category: string;
    summary: string;
    all_scores: Record<string, number>;
    confidence: number;
  } | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setResult(null);
    reset();

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      setPreview("pdf");
    } else {
      setPreview("document");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
    setResult(null);
    reset();
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    try {
      const data = await postDocument(uploadedFile).unwrap();
      setResult({
        category: data.category,
        summary: data.summary,
        all_scores: data.all_scores,
        confidence: data.confidence,
      });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    try {
      const data = await postText(textInput).unwrap();
      setResult({
        category: data.category,
        summary: data.summary,
        all_scores: data.all_scores,
        confidence: data.confidence,
      });
    } catch (err) {
      console.error("Text submit failed:", err);
    }
  };

  const switchMode = (newMode: "file" | "text") => {
    setMode(newMode);
    setResult(null);
    reset();
    resetText();
  };

  return (
    <div
      ref={ref}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
    >
      <div
        className={`bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-dashed transition-all duration-200 ${
          dragActive ? "border-[#1E59A7] bg-indigo-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => switchMode("file")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === "file"
                  ? "bg-[#1E59A7] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              File Upload
            </button>
            <button
              onClick={() => switchMode("text")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                mode === "text"
                  ? "bg-[#1E59A7] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Text Input
            </button>
          </div>

          {mode === "file" && !uploadedFile ? (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-[#1E59A7]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center px-4">
                Drag & Drop or Click to Upload
              </h3>

              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center px-4">
                Supported file formats: PDF, DOCX, and TXT. For best results,
                upload high-quality digital files. Photos or scans of documents
                are not accepted.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <label className="cursor-pointer w-full sm:w-auto">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.txt,/*"
                    onChange={handleFileChange}
                  />
                  <div className="px-6 sm:px-8 py-3 bg-[#1E59A7] text-white rounded-lg font-medium hover:bg-[#154482] transition flex items-center justify-center space-x-2 shadow-md">
                    <File className="w-5 h-5" />
                    <span>Browse Files</span>
                  </div>
                </label>
              </div>
            </>
          ) : mode === "file" ? (
            <>
              <div className="w-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    File Preview
                  </h3>
                  <Button
                    onClick={removeFile}
                    variant="outline"
                    className="p-1 border-none text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>

                {/* Preview Area */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  {preview && preview !== "pdf" && preview !== "document" ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full h-auto max-h-64 sm:max-h-96 mx-auto rounded-lg shadow-sm"
                    />
                  ) : preview === "pdf" ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                        <File className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                      </div>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        PDF Document
                      </p>
                      {uploadedFile && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center px-4 break-all">
                          {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                        <File className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      </div>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        Document File
                      </p>
                      {uploadedFile && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center px-4 break-all">
                          {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="bg-indigo-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-indigo-200">
                  <div className="flex items-center space-x-3 min-w-0">
                    <File className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      {uploadedFile && (
                        <>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {isSuccess && (
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700 font-medium">
                      Document uploaded successfully!
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {isError && (
                  <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                    <X className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      {(error as { data?: { message?: string } })?.data
                        ?.message ?? "Upload failed. Please try again."}
                    </p>
                  </div>
                )}

                {/* Result Section — Category and Summary */}
                {isSuccess && result && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Document Analysis
                    </h4>

                    {/* Category */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#1E59A7]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Category
                        </p>
                        <span className="inline-block px-3 py-1 bg-[#1E59A7] text-white text-sm font-medium rounded-full">
                          {result.category}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <ScoresComponent
                        scores={result.all_scores}
                        primaryCategory={result.category}
                        confidence={result.confidence}
                      />
                    </div>

                    {/* Summary */}
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <AlignLeft className="w-5 h-5 text-[#1E59A7]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Summary
                        </p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {result.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  disabled={isLoading || isSuccess}
                  className="w-full px-6 sm:px-8 py-3 sm:py-4 shadow-md space-x-2 text-base sm:text-lg"
                >
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>
                    {isLoading
                      ? "Uploading..."
                      : isSuccess
                        ? "Uploaded"
                        : "Process Document"}
                  </span>
                </Button>
              </div>
            </>
          ) : (
            /* TEXT INPUT MODE */
            <>
              <div className="w-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Enter Text
                  </h3>
                  <Button
                    onClick={() => {
                      setTextInput("");
                      setResult(null);
                      resetText();
                    }}
                    variant="outline"
                    className="p-1 border-none text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </div>

                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E59A7] focus:border-transparent resize-none"
                />

                {/* Success Message */}
                {isTextSuccess && (
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 mt-4">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700 font-medium">
                      Text processed successfully!
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {isTextError && (
                  <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 mt-4">
                    <X className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      {(textError as { data?: { message?: string } })?.data
                        ?.message ?? "Processing failed. Please try again."}
                    </p>
                  </div>
                )}

                {/* Result Section — Category and Summary */}
                {isTextSuccess && result && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 mt-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Text Analysis
                    </h4>

                    {/* Category */}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#1E59A7]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Category
                        </p>
                        <span className="inline-block px-3 py-1 bg-[#1E59A7] text-white text-sm font-medium rounded-full">
                          {result.category}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <ScoresComponent
                        scores={result.all_scores}
                        primaryCategory={result.category}
                        confidence={result.confidence}
                      />
                    </div>

                    {/* Summary */}
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                        <AlignLeft className="w-5 h-5 text-[#1E59A7]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                          Summary
                        </p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          {result.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  variant="primary"
                  onClick={handleTextSubmit}
                  disabled={isTextLoading || isTextSuccess || !textInput.trim()}
                  className="w-full px-6 sm:px-8 py-3 sm:py-4 shadow-md space-x-2 text-base sm:text-lg mt-4"
                >
                  <Type className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>
                    {isTextLoading
                      ? "Processing..."
                      : isTextSuccess
                        ? "Processed"
                        : "Process Text"}
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default FileUpload;
