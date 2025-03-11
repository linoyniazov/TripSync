import express, { Request, Response } from "express";
const router = express.Router();
import postController from "../controllers/post_controller";

router.post('/', postController.create.bind(postController));

router.get('/', postController.getAll.bind(postController));

router.get("/:id", (req: Request, res: Response) => {
    postController.getById(req, res);
});

router.patch("/:id", (req: Request, res: Response) => {
    postController.updateById(req, res);
});
router.delete('/:id', postController.deleteById.bind(postController));

router.put("/:id", (req: Request, res: Response) => {
    postController.updateById(req, res);
});

export default router;