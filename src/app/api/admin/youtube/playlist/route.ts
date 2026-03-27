import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getAdminUser() {
  const s = await createClient();
  const {
    data: { user },
  } = await s.auth.getUser();
  return user?.user_metadata?.role === "admin" ? user : null;
}

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId");

  if (!playlistId) {
    return NextResponse.json({ message: "Missing playlistId" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "YouTube API Key not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.error?.message || "Failed to fetch playlist" },
        { status: response.status }
      );
    }

    const items = data.items.map((item: any) => ({
      title: item.snippet.title,
      video_id: item.snippet.resourceId.videoId,
    }));

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
