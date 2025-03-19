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
 *             $ref: '#/components/schemas/Comment'
 *         likesCount:
 *           type: number
 *           description: The number of likes on the post.
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
 *       - bearerAuth: []
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
 *       - bearerAuth: []
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
 * /postInteraction/postId/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []
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
 *       - bearerAuth: []
 *     requestBody:
 *       description: Comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               userId:
 *                 type: string
 *               comment:
 *                 type: string
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

/**
 * @swagger
 * /postInteraction/like:
 *   post:
 *     summary: Add a like to a post
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Like data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *           example:
 *             postId: "examplePostId"
 *     responses:
 *       200:
 *         description: Like added successfully
 *       500:
 *         description: Internal server error
 */
router.post('/like', authMiddleware, postInteractionController.addLike.bind(postInteractionController));

/**
 * @swagger
 * /postInteraction/like:
 *   delete:
 *     summary: Remove a like from a post
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Like data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *           example:
 *             postId: "examplePostId"
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/like', authMiddleware, postInteractionController.removeLike.bind(postInteractionController));

/**
 * @swagger
 * /postInteraction/likes/{postId}:
 *   get:
 *     summary: Get likes count for a post
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with likes count
 *       500:
 *         description: Internal server error
 */
router.get('/likes/:postId', authMiddleware, postInteractionController.getLikesCount.bind(postInteractionController));


/**
 * @swagger
 * /postInteraction/comment:
 *   patch:
 *     summary: Edit a comment
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               commentId:
 *                 type: string
 *               userId:
 *                 type: string
 *               newComment:
 *                 type: string
 *           example:
 *             postId: "examplePostId"
 *             commentId: "exampleCommentId"
 *             userId: "exampleUserId"
 *             newComment: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Unauthorized to edit this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
// 🆕 עריכת תגובה
router.patch('/comment', authMiddleware, postInteractionController.editComment.bind(postInteractionController));

/**
 * @swagger
 * /postInteraction/comment:
 *   delete:
 *     summary: Delete a comment
 *     tags: [PostInteraction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               commentId:
 *                 type: string
 *               userId:
 *                 type: string
 *           example:
 *             postId: "examplePostId"
 *             commentId: "exampleCommentId"
 *             userId: "exampleUserId"
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */

// 🆕 מחיקת תגובה
router.delete('/comment', authMiddleware, postInteractionController.deleteComment.bind(postInteractionController));

export default router;