import { ObjectId } from "mongoose";
import { DISTRICTS, ITEM_STATUS } from "./item.constant";

type District = (typeof DISTRICTS)[number];

export type TItem = {
  title: string;
  description: string;
  images?: string[];
  user: ObjectId;
  questions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  likedUsers?: ObjectId[];
  dislikedUsers?: ObjectId[];
  comments?: { users: ObjectId; comment: string }[];
};
