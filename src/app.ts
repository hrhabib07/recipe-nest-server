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
    origin: [
      "http://localhost:3000", // Local development
      "https://recipe-nest.vercel.app", // Original allowed frontend domain
      "https://recipe-nest-client.vercel.app", // New frontend URL after deployment
    ],
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow credentials like cookies to be sent in requests
  })
);

// Preflight request handler
app.options("*", cors());

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
