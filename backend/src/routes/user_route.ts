import express, { Request, Response } from "express";
const router = express.Router();
import userController from "../controllers/user_controller";
import { authMiddleware } from "../controllers/auth_controller";
import { upload } from "./file_route";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing user profiles
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The password of the user.
 *         username:
 *           type: string
 *           description: The name of the user.
 *         profileImage:
 *           type: string
 *           description: URL of the user's profile photo.
 *         bio:
 *           type: string
 *           description: A brief description about the user.
 *       required:
 *         - email
 *         - password
 *         - username
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, userController.create);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/", (req: Request, res: Response) => {
  userController.getAll(req, res);
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", (req: Request, res: Response) => {
  userController.getById(req, res);
});

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", authMiddleware, upload.single("file"), (req: Request, res: Response) => {
  userController.update(req, res);
});

export default router;
