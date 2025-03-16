import apiClient from "./axiosInstance"

export interface IUser {
    email: string,
    password: string,
    username: string,
    profileImage: string,
    _id?: string,
}
export const registerUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {


    console.log("User registered successfully!");
    console.log(user);
    apiClient
      .post("/auth/register", user)
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        reject(error);
      });
    })
  };