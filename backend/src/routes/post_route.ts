import express, { Request, Response } from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */


/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     requestBody:
 *       description: Post data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'   # Reference to the Post schema
 *           example:
 *             city: "Example Post"
 *             location: "Example Location"
 *             description: "This is an example post description."
 *             photos: ["example-photo1.jpg", "example-photo2.jpg"]
 *             userId: "65aa93a86c316d58657c7f4d"
 *     responses:
 *       201:
 *         description: The created post
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

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
