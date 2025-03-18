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
    const userId = req.params.userId;
    console.log(`Fetching posts for user: ${userId}`);
    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
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

  // פונקציה חדשה להוספת לייק לפוסט
  async addLike(req: Request, res: Response) {
    console.log("addLike");
    const { postId } = req.body;
  
    try {
      let postInteraction = await PostInteraction.findOne({ postId });
  
      if (!postInteraction) {
        postInteraction = new PostInteraction({ postId, likesCount: 0 });
      }
  
      postInteraction.likesCount += 1;
      await postInteraction.save();
  
      res.status(200).json({ 
        message: 'Like added successfully',
        likesCount: postInteraction.likesCount 
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // פונקציה חדשה להסרת לייק מפוסט
  async removeLike(req: Request, res: Response) {
    console.log("removeLike");
    const { postId } = req.body;
  
    try {
      const postInteraction = await PostInteraction.findOne({ postId });
  
      if (!postInteraction) {
        res.status(404).json({ error: 'Post interaction not found' });
        return;
      }
  
      if (postInteraction.likesCount > 0) {
        postInteraction.likesCount -= 1;
        await postInteraction.save();
      }
  
      res.status(200).json({ 
        message: 'Like removed successfully',
        likesCount: postInteraction.likesCount 
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // פונקציה חדשה לקבלת מספר הלייקים של פוסט
  async getLikesCount(req: Request, res: Response) {
    console.log("getLikesCount");
    const postId = req.params.postId;
  
    try {
      const postInteraction = await PostInteraction.findOne({ postId });
  
      if (!postInteraction) {
        res.json({ likesCount: 0 });
        return;
      }
  
      res.status(200).json({ likesCount: postInteraction.likesCount });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new postInteractionController();