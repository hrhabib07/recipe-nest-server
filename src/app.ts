/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://recipe-nest.vercel.app"], // Ensure your frontend URL is listed here
    credentials: true,
  })
);

app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

//Testing
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to the recipe nest backend server API",
  });
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req, res, next) => {
  notFound(req, res, next);
});

export default app;
