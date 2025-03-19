import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request: Request) {
  try {
    console.log("DELETE endpoint reached");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    if (!session || !session.user?.name) {
      console.log("Not authenticated");
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { feedId } = await request.json();
    console.log("Feed ID from request:", feedId);
    if (!feedId) {
      console.log("No feed provided");
      return NextResponse.json({ error: 'No feed provided' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username: session.user.name } });
    console.log("Found user:", user);
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userFeed = await prisma.userFeed.findUnique({ where: { id: feedId } });
    console.log("UserFeed record found:", userFeed);
    if (userFeed && userFeed.userId === user.id) {
      console.log("Deleting user feed with id:", feedId);
      await prisma.userFeed.delete({ where: { id: feedId } });
      console.log("User feed deleted successfully");
      return NextResponse.json({ message: 'User feed removed' });
    }

    const existingRemoved = await prisma.removedFeed.findFirst({
      where: { userId: user.id, feedId },
    });
    console.log("Existing removed feed record:", existingRemoved);
    if (!existingRemoved) {
      console.log("Creating removed feed record for user:", user.id, "and feedId:", feedId);
      await prisma.removedFeed.create({
        data: {
          feedId,
          userId: user.id,
        },
      });
      console.log("Removed feed record created");
    }

    return NextResponse.json({ message: 'Feed removed for user' });
  } catch (error) {
    console.error("Error in DELETE endpoint:", error);
    return NextResponse.json({ error: "Error removing feed" }, { status: 500 });
  }
}
