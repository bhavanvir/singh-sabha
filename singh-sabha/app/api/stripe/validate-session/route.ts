import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Session ID is required" }));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified successfully",
        }),
      );
    } else {
      return new Response(JSON.stringify({ error: "Payment not succesfull" }));
    }
  } catch (error) {
    return new Response({ error: error.message });
  }
}
