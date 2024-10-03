import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { ItemRoutes } from "../modules/Item/item.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/items",
    route: ItemRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
