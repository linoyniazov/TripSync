import express from 'express';
import postInteractionController from '../controllers/post_interaction_controller';

const router = express.Router();

router.get('/', postInteractionController.getAllPosts.bind(postInteractionController));

router.get('/user/:userId', postInteractionController.getByUser.bind(postInteractionController));

router.get('/location/:location', postInteractionController.getByLocation.bind(postInteractionController));

router.get('/postId/:postId', postInteractionController.getCommentsByPostId.bind(postInteractionController));

router.post('/comment', postInteractionController.addComment.bind(postInteractionController));

export default router;