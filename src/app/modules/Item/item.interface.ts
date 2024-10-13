import { ObjectId } from "mongoose";
import { DISTRICTS, ITEM_STATUS } from "./item.constant";

export type TItem = {
  title: string;
  description: string;
  user: ObjectId;
  images?: string[];
  questions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  likedUsers?: ObjectId[];
  dislikedUsers?: ObjectId[];
  comments?: { users: ObjectId; comment: string }[];
  contentType?: "Free" | "Premium"; // Add contentType field
  // ratings?: { userId: ObjectId; score: number }[]; // Add ratings field
};
