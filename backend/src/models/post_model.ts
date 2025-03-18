import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    city: string;
    location: string;
    description: string;
    photos: string[];
    userId: mongoose.Types.ObjectId; // שינוי ל- ObjectId כדי לקשר למשתמש
    // createdAt?: Date;
    // updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
    {
        city: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        photos: {
            type: [String],
            required: true,
            validate: {
                validator: (arr: string[]) => arr.every(url => typeof url === "string"),
                message: "Each photo must be a valid URL string.",
            },
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // מקשר לטבלת המשתמשים
            required: true,
        },
    },
    { timestamps: true } // מוסיף createdAt ו- updatedAt אוטומטית

);

export default mongoose.model<IPost>("Post", postSchema);
