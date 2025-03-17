// import apiClient from "./axiosInstance";

// interface IUpoloadResponse {
//   url: string;
// }
// export const uploadImage = async (image: File) => {
//   return new Promise<string>((resolve, reject) => {
//     console.log("Uploading image..." + image);
//     const formData = new FormData();
//     if (image) {
//       formData.append("file", image);
//       apiClient
//         .post<IUpoloadResponse>("file?file=123.jpeg", formData, {
//           headers: {
//             "Content-Type": "image/jpeg",
//           },
//         })
//         .then((res) => {
//           console.log(res);
//           resolve(res.data.url);
//           // const url = res.data.url;
//           // setProfileImage(url);
//         })
//         .catch((err) => {
//           console.log(err);
//           reject(err);
//         });
//     }
//   });
// };

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

