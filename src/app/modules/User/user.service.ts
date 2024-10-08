import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { Types } from "mongoose";

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  // Populate the followers and following fields
  users.modelQuery = users.modelQuery
    .populate("followers", "profilePhoto name followers following")
    .populate("following", "profilePhoto name followers following");

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id)
    .populate("followers", "profilePhoto name followers following")
    .populate("following", "profilePhoto name followers following");

  return user;
};
const updateSingleUserFromDB = async (id: string, payload: Partial<TUser>) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user does not exist");
  }

  // Remove fields that should not be updated
  delete payload.role;
  delete payload._id;

  // Ensure bio does not exceed 101 characters if present in the payload
  if (payload.bio && payload.bio.length > 101) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Bio must be at most 101 characters long"
    );
  }

  // Initialize an update object
  const updateData: any = { ...payload };
  let followerId;
  // Handle followers update: use $addToSet to add a new follower without duplicating
  if (payload.followers) {
    followerId = payload.followers;
    updateData.$addToSet = {
      followers: payload.followers,
    };
    delete updateData.followers; // Remove followers from the payload to prevent overriding
  }

  // Handle following update: use $addToSet to add a new following without duplicating
  if (payload.following) {
    updateData.$addToSet = {
      ...updateData.$addToSet,
      following: payload.following,
    };
    delete updateData.following; // Remove following from the payload to prevent overriding
  }

  // Update user1's following and user2's followers if followerId is provided
  if (followerId) {
    const followerUpdate = User.findByIdAndUpdate(
      followerId,
      { $addToSet: { following: id } }, // Add user2 to user1's following
      { new: true }
    );

    // Execute both updates concurrently
    await Promise.all([followerUpdate]);
  }

  // Update other fields for the current user
  const result = await User.findByIdAndUpdate(id, updateData, { new: true });
  return result;
};
const unfollowUserFromDB = async (id: string, payload: any) => {
  const whoIsUnfollowing = payload.follower; // User who is unfollowing
  const userToUnfollow = id; // User being unfollowed

  // Check if the user who is being unfollowed exists
  const isUserWhomUnfollowedExist = await User.findById(userToUnfollow);
  if (!isUserWhomUnfollowedExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This user whom you want to unfollow does not exist"
    );
  }

  // Check if the user who is unfollowing exists
  const isUserWhoUnfollowExist = await User.findById(whoIsUnfollowing);
  if (!isUserWhoUnfollowExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The user who is unfollowing does not exist"
    );
  }

  // Remove the unfollowed user from the following list of the user who is unfollowing
  await User.findByIdAndUpdate(whoIsUnfollowing, {
    $pull: { following: userToUnfollow },
  });

  // Remove the user who is unfollowing from the followers list of the unfollowed user
  await User.findByIdAndUpdate(userToUnfollow, {
    $pull: { followers: whoIsUnfollowing },
  });

  return { message: "Successfully unfollowed the user" };
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateSingleUserFromDB,
  unfollowUserFromDB,
};
