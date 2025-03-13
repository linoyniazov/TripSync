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
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           description: The city associated with the post.
 *         location:
 *           type: string
 *           description: The location associated with the post.
 *         description:
 *           type: string
 *           description: A description of the post.
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of photo URLs associated with the post.
 *         userId:
 *           type: string
 *           description: The user ID associated with the post.
 *       required:
 *         - city
 *         - location
 *         - description
 *         - photos
 *         - userId
 */


/**
* @swagger
* /post:
*   post:
*     summary: add a new post
*     tags: [Posts]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*               type: object
*               properties:
*                       city:
*                           type: string
*                           description: The city associated with the post.
*                           example: "Tel Aviv"
*                       location:
*                           type: string
*                           description: The location associated with the post.
*                           example: "Dizengoff Center"
*                       description:
*                           type: string
*                           description: A description of the post.
*                           example: "Amazing place for shopping."
*                       photos:
*                           type: array
*                           items:
*                               type: string
*                           description: An array of photo URLs.
*                           example: ["photo1.jpg", "photo2.jpg"]
*     responses:
*       201:
*         description: The post was successfully created
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                       _id:
*                           type: string
*                           description: The post ID
*                           example: "60f3b4b3b3b3b3b3b3b3b3"
*                       city:
*                           type: string
*                           description: The city associated with the post.
*                           example: "Tel Aviv"
*                       location:
*                           type: string
*                           description: The location of the post.
*                           example: "Dizengoff Center"
*                       description:
*                           type: string
*                           description: The post description.
*                           example: "Amazing place for shopping."
*                       photos:
*                           type: array
*                           items:
*                               type: string
*                           description: An array of photo URLs.
*                           example: ["photo1.jpg", "photo2.jpg"]
*                       userId:
*                           type: string
*                           description: The ID of the user who created the post.
*                           example: "65aa93a86c316d58657c7f4d"
*/

router.post("/", authMiddleware, (req: Request, res: Response) => {
  postController.create(req, res);
});

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.get("/", (req: Request, res: Response) => {
  postController.getAll(req, res);
});

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

router.get("/:id", (req: Request, res: Response) => {
  postController.getById(req, res);
});

/**
 * @swagger
 * /post/{id}:
 *   patch:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post
 *     requestBody:
 *       description: Updated post data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'   # Reference to the Post schema
 *     responses:
 *       200:
 *         description: The updated post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

router.patch("/:id", authMiddleware, (req: Request, res: Response) => {
  postController.updateById(req, res);
});

/**
* @swagger
* /post/{id}:
*   delete:
*     summary: Delete a post
*     description: Delete a post by its ID
*     security:
*       - bearerAuth: []
*     tags: [Posts]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The ID of the post to delete
*     responses:
*       200:
*         description: Post deleted successfully
*       404:
*         description: Post not found
*       500:
*         description: Internal server error
*/

router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  postController.deleteById(req, res);
});
router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  postController.deleteById(req, res);
});

export default router;
