// services/stripe.service.ts
import Stripe from "stripe";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import config from "../../config";

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
    // console.log("session", session?.data?.url);
    return session;
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
