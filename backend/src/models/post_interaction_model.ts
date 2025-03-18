import mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IComment {
    userId: string;
    comment: string;
}

export interface IPostInteraction extends Document {
    postId: string;
    comments?: IComment[];
    likesCount: number;
    likedBy: string[]; // נוסיף מערך של userId-ים כדי לדעת מי לחץ לייק
}

const postInteractionSchema = new mongoose.Schema<IPostInteraction>({
    postId: {
        type: String,
        required: true,
    },
    comments: [{
        userId: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }],
    likesCount: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: [{ type: String }] // מערך userId-ים שמייצג את המשתמשים שאהבו את הפוסט
});

export default mongoose.model<IPostInteraction>('PostInteraction', postInteractionSchema);
