import mongoose from "mongoose";
import { z } from "zod";
import { DISTRICTS, ITEM_STATUS } from "./item.constant";

const createItemValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    image: z.string().optional(),
    location: z.string({
      required_error: "Location is required",
    }),
    user: z
      .string({
        required_error: "User is required",
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),

    likedUsers: z
      .array(
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid liked user ID",
        })
      )
      .optional(),

    dislikedUsers: z
      .array(
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid disliked user ID",
        })
      )
      .optional(),

    comments: z
      .array(
        z.object({
          users: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: "Invalid user ID for comment",
            }),
          comment: z.string({
            required_error: "Comment is required",
          }),
        })
      )
      .optional(),
  }),
});

const updateItemValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    location: z.string().optional(),
    user: z
      .string()
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    likedUsers: z
      .array(
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid liked user ID",
        })
      )
      .optional(),

    dislikedUsers: z
      .array(
        z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid disliked user ID",
        })
      )
      .optional(),

    comments: z
      .array(
        z.object({
          users: z
            .string()
            .refine((val) => mongoose.Types.ObjectId.isValid(val), {
              message: "Invalid user ID for comment",
            }),
          comment: z.string({
            required_error: "Comment is required",
          }),
        })
      )
      .optional(),
  }),
});

export const ItemValidation = {
  createItemValidationSchema,
  updateItemValidationSchema,
};
