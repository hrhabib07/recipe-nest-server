// services/stripe.service.ts
import Stripe from "stripe";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";
import { User } from "../User/user.model";
import { Types } from "mongoose";
import { addDays } from "date-fns";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2024-09-30.acacia",
});

const createPaymentSession = async (price: number, userEmail: string) => {
  // console.log(price, userEmail);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Membership Plan",
            },
            unit_amount: price * 100, // Convert price to cents
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      success_url: `${config.frontend_url}/success`,
      cancel_url: `${config.frontend_url}/cancel`,
    });
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    let validUntil;
    const currentDate = new Date();

    // Set subscription validity based on the price
    if (price > 1) {
      validUntil = addDays(currentDate, 30);
    } else {
      validUntil = addDays(currentDate, 1);
    }

    // Only update the user's subscription if payment is successful
    const userId = user._id;
    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        {
          subscription: {
            _id: new Types.ObjectId(), // Generate a new subscription ID
            createdAt: currentDate,
            validUntil: validUntil,
          },
        },
        { new: true }
      );
      return session;
    }
    // console.log("session", session?.data?.url);
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Stripe payment error"
    );
  }
};

export const StripeService = {
  createPaymentSession,
};
