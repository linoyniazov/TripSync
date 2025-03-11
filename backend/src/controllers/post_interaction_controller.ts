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

  async getByUser(req: Request, res: Response) {
    console.log("getPostsByUser:" + req.params.userId);
    const userId = req.params.userId;
    try {
      const postInteractions = await Post.find({ 'userId': userId });
      res.status(200).send(postInteractions);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
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
  
      if (!postInteraction.comments) {
        postInteraction.comments = [];
      }
  
      postInteraction.comments.push({ userId, comment });
  
      await postInteraction.save();
  
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  
}

export default new postInteractionController();