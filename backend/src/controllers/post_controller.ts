import Post, {IPost} from "../models/post_model";
import { Request, Response } from 'express';

class postController {

    async getAll(req: Request, res: Response) {
        console.log("getAllPosts");
        try {
            const posts = await Post.find();
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
        console.log("createPost:" + req.body);    
        try {
            // const createdPost = await Post.create(req.body);
            const { title, location, description, photos, userId } = req.body;
            const newpPost = new Post({
                title,
                location,
                description,
                photos,
                userId
            });
            await newpPost.save();
            res.status(201).json(newpPost);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
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
        console.log("deleteOrderById:" + req.body);
        const postId = req.params.id;
        try {
            const deletedPost = await Post.findByIdAndDelete(postId);
            if (!deletedPost) {
                res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).send({ message: 'Post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

export default new postController();
