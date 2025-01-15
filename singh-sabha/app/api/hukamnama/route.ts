import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.gurbaninow.com/v2/hukamnama/today",
      { next: { revalidate: 6 * 60 * 60 } }, // Every 6 hours
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: `an error occurred while fetching the hukamnama: ${err}` },
      { status: 500 },
    );
  }
}
