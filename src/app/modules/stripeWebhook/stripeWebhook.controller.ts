// controllers/stripeWebhook.controller.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fulfill the purchase, e.g., mark a membership as paid
    // Add your logic here

    console.log(`Payment successful for session: ${session.id}`);
  }

  res.status(200).json({ received: true });
});

export const StripeWebhookController = {
  handleStripeWebhook,
};