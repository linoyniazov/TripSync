// import mongoose from "mongoose";

// export interface IPost{
//     city: string;
//     location: string;
//     description: string;
//     photos: string[]; 
//     userId: string;
// }

// const postSchema = new mongoose.Schema<IPost>({
//     city: {
//         type: String,
//         required: true,
//     },
//     location: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     photos: {
//         type: [String],
//         required: true,
//     },
//     userId: {
//         type: String,
//         required: true,
//     },
// });

// export default mongoose.model<IPost>("Post", postSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    city: string;
    location: string;
    description: string;
    photos: string[];
    userId: mongoose.Types.ObjectId; // שינוי ל- ObjectId כדי לקשר למשתמש
    
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
);

export default mongoose.model<IPost>("Post", postSchema);
