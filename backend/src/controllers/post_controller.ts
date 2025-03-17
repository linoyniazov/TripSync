import Post, { IPost } from "../models/post_model";
import { Request, Response } from "express";
import mongoose from "mongoose";

class postController {
    async getAll(req: Request, res: Response) {
        console.log("getAllPosts");
        try {
            const posts = await Post.find();
            res.status(200).json(posts);
        } catch (error) {
            console.error("Error in getAllPosts:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getById(req: Request, res: Response) {
        console.log("getPostById:", req.params.id);
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid Post ID" });
        }

        try {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            return res.status(200).json(post);
        } catch (error) {
            console.error("Error in getById:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async create(req: Request, res: Response) {
        console.log("createPost:", req.body);

        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized: Invalid token" });
            }

            const { city, location, description, photos } = req.body;

            if (!city || !location || !description || !Array.isArray(photos) || photos.length === 0) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newPost = new Post({
                city,
                location,
                description,
                photos,
                userId,
            });

            await newPost.save();
            return res.status(201).json(newPost);
        } catch (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    async updateById(req: Request, res: Response) {
        console.log("updatePostById:", req.body);
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid Post ID" });
        }

        try {
            const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
            if (!updatedPost) {
                return res.status(404).json({ error: "Post not found" });
            }
            return res.status(200).json(updatedPost);
        } catch (error) {
            console.error("Error updating post:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteById(req: Request, res: Response) {
        console.log("deletePostById:", req.params.id);
        const postId = req.params.id;
        const userId = (req as any).user?.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid Post ID" });
        }

        try {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            if (post.userId.toString() !== userId) {
                return res.status(403).json({ error: "Unauthorized to delete this post" });
            }

            await Post.findByIdAndDelete(postId);
            return res.status(200).json({ message: "Post deleted successfully" });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}

export default new postController();
