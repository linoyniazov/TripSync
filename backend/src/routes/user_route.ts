import express, { Request, Response } from "express";
const router = express.Router();
import userController from "../controllers/user_controller";

router.post('/', userController.create.bind(userController));

router.get('/getusers', userController.getAll.bind(userController));

router.get("/:id", (req: Request, res: Response) => {
    userController.getById(req, res);
});

router.patch("/:id", (req: Request, res: Response) => {
    userController.update(req, res);
});

router.put("/:id", (req: Request, res: Response) => {
    userController.update(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
    userController.deleteItem(req, res);
});

export default router;
