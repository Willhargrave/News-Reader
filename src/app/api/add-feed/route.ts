import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Parser from "rss-parser";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const parser = new Parser();


export async function POST(request: Request) {
  try {
    const { link, title: customTitle, category: customCategory } = await request.json();
    if (!link) {
      return NextResponse.json({ error: "Feed link is required" }, { status: 400 });
    }
    const normalizedLink = link.toLowerCase();
    const feedData = await parser.parseURL(normalizedLink);
    const title = customTitle || feedData.title || "Untitled Feed";
    const category = (customCategory || feedData.category || "news").toLowerCase();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({ where: { username: session.user.name } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingUserFeed = await prisma.userFeed.findFirst({
      where: { link: normalizedLink, userId: user.id },
    });
    if (existingUserFeed && existingUserFeed.userId === user.id) {
      return NextResponse.json({ message: "Feed already exists", feed: existingUserFeed }, { status: 200 });
    }

    const newUserFeed = await prisma.userFeed.create({
      data: {
        title,
        link: normalizedLink,
        category,
        user: { connect: { id: user.id } },
      },
    });
    return NextResponse.json({ message: "Feed added successfully", feed: newUserFeed }, { status: 201 });
  } catch (error) {
    console.error("Error adding feed:", error);
    return NextResponse.json({ error: "Error adding feed" }, { status: 500 });
  }
}
  
