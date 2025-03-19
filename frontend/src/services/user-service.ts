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

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!emailRegex.test(trimmedEmail)) {
    throw new AuthError('Invalid email format');
  }
  
  return trimmedEmail;
};

const handleAuthResponse = (response: { data: IUser }): IUser => {
  const { accessToken, refreshToken, _id } = response.data;
  
  if (accessToken && refreshToken && _id) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", _id);
  }
  
  return response.data;
};

export const registerUser = async (user: IUser): Promise<IUser> => {
  try {
    console.log("User registering...");
    const validatedEmail = validateEmail(user.email);
    
    const formattedUser = {
      ...user,
      email: validatedEmail
    };
    
    const response = await apiClient.post<IUser>("/auth/register", formattedUser);
    return handleAuthResponse(response);
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error instanceof AuthError) {
      throw error;
    }
    
    // בדיקה אם השגיאה היא בגלל שהמייל כבר קיים
    if (error.response?.status === 400 && error.response?.data?.message?.includes('exists')) {
      throw new AuthError('An account with this email already exists');
    }
    
    throw new AuthError(
      error.response?.data?.message || 
      "Registration failed. Please try again."
    );
  }
};

export const loginUser = async (user: IUser): Promise<IUser> => {
  try {
    console.log("User logging in...");
    const validatedEmail = validateEmail(user.email);
    
    const formattedUser = {
      ...user,
      email: validatedEmail
    };
    
    const response = await apiClient.post<IUser>("/auth/login", formattedUser);
    return handleAuthResponse(response);
  } catch (error: any) {
    console.error("Login error:", error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      error.response?.data?.message || 
      "Invalid email or password."
    );
  }
};

export const googleSignin = async (
  credentialResponse: CredentialResponse
): Promise<IUser> => {
  try {
    console.log("Google sign in...");
    const response = await apiClient.post<IUser>(
      "/auth/google", 
      credentialResponse
    );
    return handleAuthResponse(response);
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    throw new AuthError(
      error.response?.data?.message || 
      "Google sign-in failed. Please try again."
    );
  }
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refreshToken });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }
};
// import { CredentialResponse } from "@react-oauth/google";
// import apiClient from "./axiosInstance";

// export interface IUser {
//   email: string;
//   password?: string;
//   username?: string;
//   profileImage?: string;
//   _id?: string;
//   accessToken?: string;
//   refreshToken?: string;
// }

// class AuthError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = 'AuthError';
//   }
// }

// const validateEmail = (email: string): string => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const trimmedEmail = email.trim().toLowerCase();
  
//   if (!emailRegex.test(trimmedEmail)) {
//     throw new AuthError('Invalid email format');
//   }
  
//   return trimmedEmail;
// };

// const handleAuthResponse = (response: { data: IUser }): IUser => {
//   const { accessToken, refreshToken, _id } = response.data;
  
//   if (accessToken && refreshToken && _id) {
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);
//     localStorage.setItem("userId", _id);
//   }
  
//   return response.data;
// };

// export const registerUser = async (user: IUser): Promise<IUser> => {
//   try {
//     console.log("User registering...");
//     const validatedEmail = validateEmail(user.email);
    
//     const formattedUser = {
//       ...user,
//       email: validatedEmail
//     };
    
//     const response = await apiClient.post<IUser>("/auth/register", formattedUser);
//     return handleAuthResponse(response);
//   } catch (error: any) {
//     console.error("Registration error:", error);
//     if (error instanceof AuthError) {
//       throw error;
//     }
//     throw new AuthError(
//       error.response?.data?.message || 
//       "Registration failed. Please try again."
//     );
//   }
// };

// export const loginUser = async (user: IUser): Promise<IUser> => {
//   try {
//     console.log("User logging in...");
//     const validatedEmail = validateEmail(user.email);
    
//     const formattedUser = {
//       ...user,
//       email: validatedEmail
//     };
    
//     const response = await apiClient.post<IUser>("/auth/login", formattedUser);
//     return handleAuthResponse(response);
//   } catch (error: any) {
//     console.error("Login error:", error);
//     if (error instanceof AuthError) {
//       throw error;
//     }
//     throw new AuthError(
//       error.response?.data?.message || 
//       "Invalid email or password."
//     );
//   }
// };

// export const googleSignin = async (
//   credentialResponse: CredentialResponse
// ): Promise<IUser> => {
//   try {
//     console.log("Google sign in...");
//     const response = await apiClient.post<IUser>(
//       "/auth/google", 
//       credentialResponse
//     );
//     return handleAuthResponse(response);
//   } catch (error: any) {
//     console.error("Google sign-in error:", error);
//     throw new AuthError(
//       error.response?.data?.message || 
//       "Google sign-in failed. Please try again."
//     );
//   }
// };

// export const logout = async (): Promise<void> => {
//   try {
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (refreshToken) {
//       await apiClient.post("/auth/logout", { refreshToken });
//     }
//   } catch (error) {
//     console.error("Logout error:", error);
//   } finally {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("userId");
//   }
// };