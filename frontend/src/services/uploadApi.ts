import baseApi from "./baseApi";

interface UploadResponse {
  id: string;
  fileName: string;
  message: string;
  uploadedAt: string;
  category: string;
  summary: string;
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
  }),
});

export const { usePostDocumentMutation } = uploadApi;
