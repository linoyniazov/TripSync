import apiClient from "./axiosInstance";

interface IUpoloadResponse {
  url: string;
}
export const uploadImage = async (image: File) => {
  return new Promise<string>((resolve, reject) => {
    console.log("Uploading image..." + image);
    const formData = new FormData();
    if (image) {
      formData.append("file", image);
      apiClient
        .post<IUpoloadResponse>("file?file=123.jpeg", formData, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        })
        .then((res) => {
          console.log(res);
          resolve(res.data.url);
          // const url = res.data.url;
          // setProfileImage(url);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    }
  });
};
