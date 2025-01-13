import { NextResponse } from "next/server";

export async function GET() {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCtMxxM3Lr4qf8_EzrQORhQg";

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 1 * 60 * 60 } },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from YouTube API");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const liveStream = data.items[0];
      const result = {
        title: liveStream.snippet.title,
        videoId: liveStream.id.videoId,
        description: liveStream.snippet.description,
        thumbnails: liveStream.snippet.thumbnails,
      };
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ message: "No live streams currently" });
    }
  } catch (err) {
    return NextResponse.json(
      { error: `An error occurred while fetching the live stream: ${err}` },
      { status: 500 },
    );
  }
}
