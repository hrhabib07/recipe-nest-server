import { QueryBuilder } from "../../builder/QueryBuilder";
import { TImageFiles } from "../../interfaces/image.interface";
import { User } from "../User/user.model";
// import {
//   addDocumentToIndex,
//   deleteDocumentFromIndex,
// } from '../../utils/meilisearch';
import { ItemsSearchableFields } from "./item.constant";
import { TItem } from "./item.interface";
import { Item } from "./item.model";
import {
  SearchItemByDateRangeQueryMaker,
  SearchItemByUserQueryMaker,
} from "./item.utils";

const createItemIntoDB = async (payload: TItem, images: TImageFiles) => {
  const { itemImages } = images;
  payload.images = itemImages.map((image) => image.path);

  // Create the item in the database
  const result = await Item.create(payload);

  // Push the created item's ID into the user's posts array
  await User.findByIdAndUpdate(payload.user, {
    $push: { posts: result._id },
  });
  // await addDocumentToIndex(result, 'items');
  return result;
};

const getAllItemsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchItemByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchItemByDateRangeQueryMaker(query)) || query;

  const itemQuery = new QueryBuilder(
    Item.find().populate("user").populate({
      path: "comments.users",
      select: "name email profilePhoto",
    }),
    query
  )
    .filter()
    .search(ItemsSearchableFields)
    .sort()
    // .paginate()
    .fields();

  const result = await itemQuery.modelQuery;

  return result;
};

const getItemFromDB = async (itemId: string) => {
  const result = await Item.findById(itemId).populate("user");
  return result;
};

const updateItemInDB = async (itemId: string, payload: Partial<TItem>) => {
  const updateOperations: any = {};
  console.log("payload: ", payload);
  // Check if comments are present in the payload and push to the existing comments array
  if (payload.comments) {
    updateOperations.$push = { comments: { $each: payload.comments } };
  }

  // Handle likes and dislikes logic
  if (payload.likedUsers) {
    updateOperations.$pull = { dislikedUsers: { $in: payload.likedUsers } }; // Remove user from dislikedUsers if present
    updateOperations.$addToSet = { likedUsers: { $each: payload.likedUsers } }; // Add user to likedUsers array
  }

  if (payload.dislikedUsers) {
    updateOperations.$pull = { likedUsers: { $in: payload.dislikedUsers } }; // Remove user from likedUsers if present
    updateOperations.$addToSet = {
      dislikedUsers: { $each: payload.dislikedUsers },
    }; // Add user to dislikedUsers array
  }

  // Add other fields to the updateOperations object for generic updates
  Object.keys(payload).forEach((key) => {
    if (!["comments", "likedUsers", "dislikedUsers"].includes(key)) {
      updateOperations.$set = updateOperations.$set || {};
      updateOperations.$set[key] = (payload as any)[key];
    }
  });
  console.log("options", updateOperations);

  // Perform the update operation with the constructed updateOperations object
  const result = await Item.findByIdAndUpdate(itemId, updateOperations, {
    new: true,
  });
  return result;
};

const deleteItemFromDB = async (itemId: string) => {
  const result = await Item.findByIdAndDelete(itemId);
  // const deletedItemId = result?._id;
  // if (deletedItemId) {
  //   await deleteDocumentFromIndex('items', deletedItemId.toString());
  // }
  return result;
};

export const ItemServices = {
  createItemIntoDB,
  getAllItemsFromDB,
  getItemFromDB,
  updateItemInDB,
  deleteItemFromDB,
};
