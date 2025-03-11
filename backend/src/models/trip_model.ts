import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  creator: mongoose.Schema.Types.ObjectId;
  participants: mongoose.Schema.Types.ObjectId[];
  likes: mongoose.Schema.Types.ObjectId[];
}

const TripSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model<ITrip>("Trip", TripSchema);
