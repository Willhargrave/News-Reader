import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.name) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { feedId } = await request.json();
  if (!feedId) {
    return NextResponse.json({ error: 'No feed provided' }, { status: 400 });
  }

  // Retrieve user
  const user = await prisma.user.findUnique({ where: { username: session.user.name } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get the current removedFeeds array (as a string array)
  const removedFeeds: string[] = user.removedFeeds as string[] || [];
  if (!removedFeeds.includes(feedId)) {
    removedFeeds.push(feedId);
  }

  const updatedUser = await prisma.user.update({
    where: { username: session.user.name },
    data: { removedFeeds },
  });

  return NextResponse.json({ message: 'Feed removed', removedFeeds: updatedUser.removedFeeds });
}