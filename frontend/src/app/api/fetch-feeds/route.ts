import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

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
  
  const feeds = await prisma.feed.findMany();
  const filteredFeeds = feeds.filter(feed => !removedFeedIds.includes(feed.id));
  return NextResponse.json({ feeds: filteredFeeds });
}
