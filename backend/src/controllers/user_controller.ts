import { Request, Response } from "express";
import UserModel from "../models/user_model";
// Create a new user
export const create = async (req: Request, res: Response) => {
  try {
    const { username, email, password, profileImage, bio } = req.body;
    const newUser = new UserModel({ username, email, password, profileImage, bio });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all users
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user by ID

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username, profileImage, bio } = req.body;

    // Check if the user exists first
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, profileImage, bio },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Delete user by ID
export const deleteUser= async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  create,
  getAll,
  getById,
  update,
  deleteUser
};