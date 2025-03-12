import express from 'express';
import postInteractionController from '../controllers/post_interaction_controller';
import {authMiddleware} from "../controllers/auth_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PostInteraction
 *   description: API for managing post interactions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The user ID associated with the comment.
 *         comment:
 *           type: string
 *           description: The text content of the comment.
 *       required:
 *         - userId
 *         - comment
 *
 *     PostInteraction:
 *       type: object
 *       properties:
 *         postId:
 *           type: string
 *           description: The ID of the post associated with the interaction.
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'  # Reference to the Comment schema
 *       required:
 *         - postId
 */

/**
 * @swagger
 * /postInteraction:
 *   get:
 *     summary: Get all post interactions
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, postInteractionController.getAllPosts.bind(postInteractionController));
/**
 * @swagger
 * /postInteraction/user/{userId}:
 *   get:
 *     summary: Get post interactions by user
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authMiddleware, postInteractionController.getByUser.bind(postInteractionController));
/**
 * @swagger
 * /postInteraction/location/{location}:
 *   get:
 *     summary: Get post interactions by location
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         description: Location name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/location/:location', authMiddleware, postInteractionController.getByLocation.bind(postInteractionController));
/**
 * @swagger
 * /postInteraction/postId/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/postId/:postId', authMiddleware, postInteractionController.getCommentsByPostId.bind(postInteractionController));
/**
 * @swagger
 * /postInteraction/comment:
 *   post:
 *     summary: Add a comment to a post interaction
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []  # Use bearer token for authentication
 *     requestBody:
 *       description: Comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'  # Reference to the Comment schema
 *           example:
 *             postId: "examplePostId"
 *             userId: "exampleUserId"
 *             comment: "This is an example comment."
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       500:
 *         description: Internal server error
 */
router.post('/comment', authMiddleware, postInteractionController.addComment.bind(postInteractionController));

export default router;