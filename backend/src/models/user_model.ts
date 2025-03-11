import mongoose, { Document, Schema, Types } from "mongoose";
import { IPost } from "./post_model";

// Define User schema
export interface IUser {
  email: string;
  password: string;
  _id?: string;
  refreshTokens?: string[];
  username: string;
  profileImage?: string;
  bio?: string;
  posts?: Types.Array<IPost>;
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
  },
  bio: {
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "post_model",
    },
  ],
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;