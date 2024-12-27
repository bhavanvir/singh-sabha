import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { event } = await request.json();
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: event.registrantEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${event.eventType.displayName} Booking Deposit`,
            },
            unit_amount: event.eventType.deposit * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&event_id=${event.id}`,
      cancel_url: `${origin}/cancel?event_id=${event.id}`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
    });
  }
}
