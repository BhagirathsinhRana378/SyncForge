import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  avatar: string;
  socketId?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    socketId: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;