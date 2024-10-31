import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.gurbaninow.com/v2/hukamnama/today",
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching the Hukamnama" },
      { status: 500 },
    );
  }
}
