import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserFeed } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  let removedFeedIds: string[] = [];
  const session = await getServerSession(authOptions);
  let user = null;
  if (session && session.user?.name) {
    user = await prisma.user.findUnique({
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
  
  let customFeeds: UserFeed[] = [];
  if (session && session.user?.name && user) {
    customFeeds = await prisma.userFeed.findMany({
      where: { userId: user.id },
    });
  }
  
  const feeds = [...filteredGlobalFeeds, ...customFeeds];
  
  return NextResponse.json({ feeds });
}

