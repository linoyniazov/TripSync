import express, { Request, Response } from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.post("/", authMiddleware, (req: Request, res: Response) => {
  postController.create(req, res);
});
router.get("/", (req: Request, res: Response) => {
  postController.getAll(req, res);
});
router.get("/:id", (req: Request, res: Response) => {
  postController.getById(req, res);
});

router.patch("/:id", authMiddleware, (req: Request, res: Response) => {
  postController.updateById(req, res);
});
router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  postController.deleteById(req, res);
});

export default router;
