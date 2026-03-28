import baseApi from "./baseApi";

interface UploadResponse {
  id: string;
  fileName: string;
  message: string;
  uploadedAt: string;
  category: string;
  summary: string;
  all_scores: Record<string, number>;
  confidence: number;
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postDocument: build.mutation<UploadResponse, File>({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/upload",
          method: "POST",
          body: formData,
        };
      },
    }),
    postText: build.mutation<UploadResponse, string>({
      query: (text: string) => ({
        url: "/text",
        method: "POST",
        body: { text },
      }),
    }),
  }),
});

export const { usePostDocumentMutation, usePostTextMutation } = uploadApi;
