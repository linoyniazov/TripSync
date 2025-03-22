import apiClient from "./axiosInstance";

interface IUploadResponse {
  url: string;
}

export const uploadImage = async (image: File) => {
  return new Promise<string>((resolve, reject) => {
    console.log("Uploading image...", image);
    
    const formData = new FormData();
    formData.append("file", image);

    apiClient
      .post<IUploadResponse>("/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Upload successful:", res);
        resolve(res.data.url);
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        reject(err);
      });
  });
};

