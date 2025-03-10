import mongoose, { Document, Schema, Types } from "mongoose";

// Define User schema
export interface IUser {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  refreshToken?: string[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  bio: { type: String },
  refreshToken: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;