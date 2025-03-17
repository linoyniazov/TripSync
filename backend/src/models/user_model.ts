import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  _id?: string;
  refreshTokens?: string[];
  username: string;
  profileImage?: string;
  bio?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "http://localhost:5000/public/avatar.jpeg",
  },
  bio: {
    type: String,
  },
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;