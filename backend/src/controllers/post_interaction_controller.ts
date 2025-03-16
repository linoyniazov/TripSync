import { Request, Response } from 'express';
import PostInteraction, {IPostInteraction, IComment} from '../models/post_interaction_model';
import Post, {IPost} from "../models/post_model";
import mongoose from 'mongoose';

class postInteractionController {

  async getAllPosts(req: Request, res: Response) {
    console.log("getAllPosts");
    try {
      const postInteractions = await Post.find();
      res.send(postInteractions);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getByUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    console.log(`Fetching posts for user: ${userId}`);
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return; // Ensure the function exits after sending a response
    }
    try {
        const posts = await Post.find({ userId });
        console.log(`Posts found: ${JSON.stringify(posts)}`);
        res.status(200).json(posts);
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

  async getByLocation(req: Request, res: Response) {
    console.log("getPostsByLocation:" + req.params.location);
    const location = req.params.location;

    try {
      const postInteractions = await Post.find({ 'location': location });
      res.status(200).send(postInteractions);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCommentsByPostId(req: Request, res: Response) {
    console.log("getAllCommentsforPostId" + req.params.postId);
    const postId = req.params.postId;
    try {
      const postInteractions = await PostInteraction.find({ postId: postId });
      res.send(postInteractions);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

  async addComment(req: Request, res: Response) {
    console.log("postComment");
    const { postId, userId, comment }: { postId: string; userId: string; comment: string } = req.body;
  
    try {
      let postInteraction: IPostInteraction | null = await PostInteraction.findOne({ postId });
  
      if (!postInteraction) {
        postInteraction = new PostInteraction({ postId, comments: [] });
      }
  
      postInteraction.comments?.push({ userId, comment });
  
      await postInteraction.save();
  
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  
}

export default new postInteractionController();