import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./axiosInstance";

export interface IUser {
  email: string;
  password?: string;
  username?: string;
  profileImage?: string;
  _id?: string;
  accessToken?: string;
  refreshToken?: string;
}
export const registerUser = (user: IUser) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("User registered successfully!");
    console.log(user);
    apiClient
      .post("/auth/register", user)
      .then((response) => {
        console.log(response);

        // ✅ שמירת טוקנים ב- localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data._id);  // ✅ שמירת ה- userId

        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

// ✅ פונקציה להתחברות (Login)
export const loginUser = (user: IUser) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("User logging in...");
    console.log(user);
    apiClient
      .post("/auth/login", user)
      .then((response) => {
        console.log(response);

        // ✅ שמירת טוקנים ב- localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data._id);  // ✅ שמירת ה- userId
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error logging in user:", error);
        reject(error);
      });
  });
};
export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("google sign in...");
    apiClient
      .post("/auth/google", credentialResponse)
      .then((response) => {
        console.log(response);

        // ✅ שמירת טוקנים ב- localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data._id);  
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        reject(error);
      });
  });
};
