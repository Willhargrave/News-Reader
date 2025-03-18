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

  const user = await prisma.user.findUnique({ where: { username: session.user.name } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const userFeed = await prisma.userFeed.findUnique({ where: { id: feedId } });
  if (userFeed && userFeed.userId === user.id) {
    await prisma.userFeed.delete({ where: { link: feedId } });
    return NextResponse.json({ message: 'User feed removed' });
  }

  const existingRemoved = await prisma.removedFeed.findFirst({
    where: { userId: user.id, feedId },
  });
  if (!existingRemoved) {
    await prisma.removedFeed.create({
      data: {
        feedId,
        userId: user.id,
      },
    });
  }

  return NextResponse.json({ message: 'Feed removed for user' });
}