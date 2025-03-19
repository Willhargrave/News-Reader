import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { UserFeed } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) {
  const session = await getServerSession(authOptions);
  let removedFeedIds: string[] = [];
  let customFeeds: UserFeed[] = [];

  if (session && session.user?.name) {
    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
    });
    if (user) {
      const removedFeedRecords = await prisma.removedFeed.findMany({
        where: { userId: user.id },
      });
      removedFeedIds = removedFeedRecords.map(record => record.feedId);

      customFeeds = await prisma.userFeed.findMany({
        where: { userId: user.id },
      });
    }
  }

  const filteredGlobalFeeds = await prisma.feed.findMany({
    where: { id: { notIn: removedFeedIds } },
  });

  const feeds = [...filteredGlobalFeeds, ...customFeeds];

  return NextResponse.json({ feeds });
}