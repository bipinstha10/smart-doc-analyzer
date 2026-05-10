// uploadApi.ts
import type { DocumentResponse } from "../types/document";
import baseApi from "./baseApi";

// interface UploadResponse {
//   id: string;
//   fileName: string;
//   message: string;
//   uploadedAt: string;
//   category: string;
//   confidence: number;
//   all_scores: Record<string, number>;
//   summary: string;
//   inferenceTime: number; // ✅ add missing fields
//   originalLength: number;
//   summaryLength: number;
// }

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postDocument: build.mutation<DocumentResponse, File>({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/documents/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Document"],
    }),
    postText: build.mutation<DocumentResponse, string>({
      query: (text: string) => ({
        url: "/documents/text",
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Document"],
    }),
    getDocuments: build.query<DocumentResponse[], void>({
      query: () => "/documents",
      providesTags: ["Document"],
    }),
    getDocument: build.query<DocumentResponse, number>({
      query: (id) => `/documents/${id}`,
      providesTags: (result, error, id) => [{ type: "Document", id }],
    }),
  }),
});

export const {
  usePostDocumentMutation,
  usePostTextMutation,
  useGetDocumentsQuery,
  useGetDocumentQuery,
} = uploadApi;
