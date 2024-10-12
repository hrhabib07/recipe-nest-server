/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant";

export type TUser = {
  _id?: string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  mobileNumber?: string;
  profilePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  followers?: Types.ObjectId[] | [];
  following?: Types.ObjectId[] | [];
  posts?: Types.ObjectId[] | [];
  dislikedPosts?: Types.ObjectId[] | [];
  likedPosts?: Types.ObjectId[] | [];
  subscription?: {
    _id: Types.ObjectId;
    createdAt: Date;
    validUntil: string;
  } | null;
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
