import { Request, Response } from "express";
import UserModel, { IUser } from "../models/user_model";
import { AuthResquest } from "../middlewares/auth_middleware";
const getUserProfile = async (req: AuthResquest, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    // Retrieve user profile information based on userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = {
      email: user.email,
      Name: user.name,
      profilePhoto: user.profilePhoto,
      aboutMe: user.aboutMe,
    };

    res.json({ userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "getUserProfile server error" });
  }
};

const updateUserProfile = async (req: AuthResquest, res: Response) => {
  try {
    const userId = req.params.userId;
    const { name, profilePhoto, aboutMe } = req.body;

    // Update user profile information based on userId
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, profilePhoto, aboutMe },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "updateUserProfile server error" });
  }
};

export default {
  updateUserProfile,
  getUserProfile,
};