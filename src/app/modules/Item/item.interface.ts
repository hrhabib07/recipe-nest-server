import { ObjectId } from "mongoose";
import { DISTRICTS, ITEM_STATUS } from "./item.constant";

type District = (typeof DISTRICTS)[number];

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
};
