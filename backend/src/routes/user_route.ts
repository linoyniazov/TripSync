import express, { Request, Response } from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import {authMiddleware} from "../controllers/auth_controller";

router.post("/", authMiddleware, userController.create);

router.get("/", (req: Request, res: Response) => {
    userController.getAll(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
    userController.getById(req, res);
});

router.patch("/:id", authMiddleware,(req: Request, res: Response) => {
    userController.update(req, res);
});

router.put("/:id", authMiddleware, (req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete("/:userId", authMiddleware, (req: Request, res: Response) => {
    userController.deleteUser(req, res);
});

export default router;
