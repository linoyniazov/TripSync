import mongoose, { Document, Schema } from 'mongoose';


// ממשק לתגובה (כולל _id כדי שנוכל לערוך/למחוק תגובה ספציפית)
export interface IComment {
  _id?: mongoose.Types.ObjectId;
  userId: string;
  comment: string;
}

// ממשק למסמך PostInteraction
export interface IPostInteraction extends Document {
  postId: string;
  comments?: IComment[];
  likesCount: number;
  likedBy: string[];
}

// סכמת תגובה (מאפשרת אוטומטית יצירת _id לכל תגובה)
const commentSchema = new Schema<IComment>(
  {
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { _id: true } // ← מוודא שמונגוס יוצר מזהה אוטומטי לכל תגובה
);

// סכמת PostInteraction
const postInteractionSchema = new Schema<IPostInteraction>({
  postId: {
    type: String,
    required: true,
  },
  comments: [commentSchema], // ← שימוש בסכמת תגובות
  likesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  likedBy: [{ type: String }],
});

export default mongoose.model<IPostInteraction>(
  'PostInteraction',
  postInteractionSchema
);
