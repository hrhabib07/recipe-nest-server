import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";

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

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  return user;
};
const updateSingleUserFromDB = async (id: string, payload: Partial<TUser>) => {
  const isUserExist = await User.findById(id);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "This user does not exists");
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

  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateSingleUserFromDB,
};
