import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(request: Request) {
  try {
    const { link, title: customTitle, category: customCategory } = await request.json();
    if (!link) {
      return NextResponse.json({ error: "Feed link is required" }, { status: 400 });
    }

    const feed = await parser.parseURL(link);
    const title = customTitle || feed.title || "Untitled Feed";
    const category = customCategory || feed.category || "news"

    const newFeed = await prisma.feed.create({
      data: { title, link, category },
    });

    return NextResponse.json(
      { message: "Feed added successfully", feed: newFeed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding feed:", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Feed already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error adding feed" }, { status: 500 });
  }
}