import Stripe from "stripe"

const stripeApiKey = process.env.STRIPE_API_KEY;

if (!stripeApiKey) {
  throw new Error("STRIPE_API_KEY is not defined in the environment variables.");
}

export const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2024-04-10",
  typescript: true,
})
