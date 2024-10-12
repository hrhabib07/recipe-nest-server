// controllers/stripe.controller.ts
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { StripeService } from "./stripe.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const { price, email } = req.body; // Expecting price and user email in the request body
    const session = await StripeService.createPaymentSession(price, email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: { sessionId: session.id, url: session.url },
    });
  }
);

export const StripeController = {
  createCheckoutSession,
};
