import mongoose from "mongoose";

export interface IPost{
    city: string;
    location: string;
    description: string;
    photos: string[]; 
    userId: string;
}

const postSchema = new mongoose.Schema<IPost>({
    city: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

export default mongoose.model<IPost>("Post", postSchema);