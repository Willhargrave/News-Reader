import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  let removedFeedIds: string[] = [];
  const session = await getServerSession(authOptions);
  
  if (session && session.user?.name) {
    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
    });
    if (user && user.removedFeeds) {
      removedFeedIds = user.removedFeeds as string[];
    }
  }
  
  const globalFeeds = await prisma.feed.findMany();
  const filteredGlobalFeeds = globalFeeds.filter(
    (feed) => !removedFeedIds.includes(feed.id)
  );
  
  let customFeeds = [];
  if (session && session.user?.name) {
    customFeeds = await prisma.userFeed.findMany({
      where: { user: { username: session.user.name } },
    });
  }

  const feeds = [...filteredGlobalFeeds, ...customFeeds];
  
  const groupedFeeds = feeds.reduce((acc, feed) => {
  const category = feed.category || "news";
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(feed);
  return acc;
}, {} as Record<string, typeof feeds>);

return NextResponse.json({ feeds: groupedFeeds });
}
