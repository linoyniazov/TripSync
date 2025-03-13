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
        console.log("createPost:", req.body);

        try {
            // שליפת userId מתוך ה- JWT (אחרי שה- `authMiddleware` שמר אותו ב- `req.query.user`)
            const userId = req.query.user;
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
// import Post, {IPost} from "../models/post_model";
// import { Request, Response } from 'express';

// class postController {

//     async getAll(req: Request, res: Response) {
//         console.log("getAllPosts");
//         try {
//             const posts = await Post.find();
//             res.send(posts);
//         } catch (error) {
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }

//     async getById(req: Request, res: Response) {
//         console.log("getPostById:" + req.params.id);
//         const postId = req.params.id;
//         try {
//             const post = await Post.findById(postId);
//             if (!post) {
//                 res.status(404).json({ error: 'Post not found' });
//             }
//             res.send(post);
//         } catch (error) {
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }

//     async create(req: Request, res: Response) {
//         console.log("createPost:" + req.body);    
//         try {
//             // const createdPost = await Post.create(req.body);
//             const { title, location, description, photos, userId } = req.body;
//             const newpPost = new Post({
//                 title,
//                 location,
//                 description,
//                 photos,
//                 userId
//             });
//             await newpPost.save();
//             res.status(201).json(newpPost);
//         } catch (error) {
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }

//     async updateById(req: Request, res: Response) {
//         console.log("updateOrderById:"+ req.body);
//         const postId= req.params.id;
//         try {
//             const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {new: true});
//             if (!updatedPost) {
//                 return res.status(404).json({ error: 'Post not found' });
//             }
//             res.send(updatedPost);
//         } catch (error) {
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }

//     async deleteById(req: Request, res: Response) {
//         console.log("deleteOrderById:" + req.body);
//         const postId = req.params.id;
//         try {
//             const deletedPost = await Post.findByIdAndDelete(postId);
//             if (!deletedPost) {
//                 res.status(404).json({ error: 'Post not found' });
//             }
//             res.status(200).send({ message: 'Post deleted successfully' });
//         } catch (error) {
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     }

// }

// export default new postController();
