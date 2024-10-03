import { Schema, model } from "mongoose";
import { DISTRICTS, ITEM_STATUS } from "./item.constant";
import { TItem } from "./item.interface";

const itemSchema = new Schema<TItem>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    dislikedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    comments: [
      {
        users: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

export const Item = model<TItem>("Item", itemSchema);
