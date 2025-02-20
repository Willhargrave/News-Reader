import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(request: Request) {
  try {
    const { link } = await request.json();
    if (!link) {
      return NextResponse.json({ error: "Feed link is required" }, { status: 400 });
    }
    const feed = await parser.parseURL(link);
    const title = feed.title || "Untitled Feed";
    return NextResponse.json({ title });
  } catch (error) {
    console.error("Error previewing feed:", error);
    return NextResponse.json({ error: "Error previewing feed" }, { status: 500 });
  }
}