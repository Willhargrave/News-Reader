import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Parser from "rss-parser";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

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
  
      let existingFeed = await prisma.feed.findUnique({ where: { link: normalizedLink } });
      const session = await getServerSession(authOptions);
  
      if (existingFeed) {
        if (customTitle && customTitle !== existingFeed.title) {
          existingFeed = await prisma.feed.update({
            where: { link: normalizedLink },
            data: { title },
          });
        }
        if (session && session.user?.name) {
          const user = await prisma.user.findUnique({ where: { username: session.user.name } });
          if (user) {
            const removedFeeds: string[] = user.removedFeeds as string[] || [];
            if (removedFeeds.includes(existingFeed!.id)) {
              const updatedRemovedFeeds = removedFeeds.filter(
                (feedId) => feedId !== existingFeed!.id
              );
              await prisma.user.update({
                where: { username: user.username },
                data: { removedFeeds: updatedRemovedFeeds },
              });
            }
          }
        }
        return NextResponse.json({ message: "Feed already exists", feed: existingFeed }, { status: 200 });
      }
  
      const newFeed = await prisma.feed.create({
        data: { title, link: normalizedLink, category },
      });
      return NextResponse.json({ message: "Feed added successfully", feed: newFeed }, { status: 201 });
    } catch (error) {
      console.error("Error adding feed:", error);
      return NextResponse.json({ error: "Error adding feed" }, { status: 500 });
    }
  }
  
