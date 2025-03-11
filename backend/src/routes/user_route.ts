import express from "express";
import userController from "../controllers/user_controller";
import authMiddleware from "../middlewares/auth_middleware";
const router = express.Router();

router.get("/:userId", authMiddleware, userController.getUserProfile);
router.patch("/:userId", authMiddleware, userController.updateUserProfile);

export default router;