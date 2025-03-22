import Post, { IPost } from "../models/post_model";
import { Request, Response } from 'express';
import fs from "fs";
import path from "path";


class postController {
    async getAll(req: Request, res: Response) {
        console.log("getAllPosts");
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const posts = await Post.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            res.send(posts);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getById(req: Request, res: Response) {
        console.log("getPostById:" + req.params.id);
        const postId = req.params.id;
        try {
            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
            }
            res.send(post);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async create(req: Request, res: Response) {
        console.log("createPost:", req.body);

        try {
            // שליפת userId מתוך ה- JWT (אחרי שה- `authMiddleware` שמר אותו ב- `req.query.user`)
            const userId = (req as any).user;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized: Invalid token" });
            }

            // שליפת הנתונים מהבקשה
            const { city, location, description, photos } = req.body;

            // בדיקת תקינות הנתונים
            if (!city || !location || !description || !photos || !Array.isArray(photos)) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // יצירת פוסט חדש
            const newPost = new Post({
                city,
                location,
                description,
                photos,
                userId, // קישור הפוסט למשתמש המחובר
            });

            await newPost.save();
            return res.status(201).json(newPost);
        } catch (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateById(req: Request, res: Response) {
        console.log("updateOrderById:"+ req.body);
        const postId= req.params.id;
        try {
            const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {new: true});
            if (!updatedPost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.send(updatedPost);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteById(req: Request, res: Response) {
        console.log("deletePostById:", req.params.id);
        const postId = req.params.id;
        const userId = req.query.user; // ה-ID מהטוקן
        console.log("User ID from token:", userId);
    
        try {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
    
            // 🔹 רק הבעלים של הפוסט יכול למחוק אותו
            if (post.userId.toString() !== userId) {
                return res.status(403).json({ error: "Unauthorized to delete this post" });
            }
    
            await Post.findByIdAndDelete(postId);
            res.status(200).json({ message: "Post deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}    

export default new postController();