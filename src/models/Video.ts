import mongoose, { Document, Schema, STATES, Types } from "mongoose";

export interface IVideo extends Document {
  description: string;
  videoUrl: string;
  publicId: string;
  createdAt: Date;
  userId:Types.ObjectId;
  duration: number;
  title: string | number;
  profil: string;
  public_id: string;

  userName: string;
  likes: string[]; 
  dislikes: string[];
  channelId: mongoose.Types.ObjectId;
  channel: string;
}

const videoSchema: Schema = new Schema<IVideo>({
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  profil: { type: String },
  likes: [{ type: String }], 
  dislikes: [{ type: String}], 
  userName: { type: String },
  duration: { type: Number, required: true },
  title: { type: String, required: true },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
});

const Video = mongoose.model<IVideo>("Video", videoSchema);
export default Video;
