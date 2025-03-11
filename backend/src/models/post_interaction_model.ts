import mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IComment {
    userId: string;
    comment: string;
  }

export interface IPostInteraction extends Document {
    postId: string;
    comments?: IComment[];
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
  });

export default mongoose.model<IPostInteraction>('PostInteraction', postInteractionSchema);
