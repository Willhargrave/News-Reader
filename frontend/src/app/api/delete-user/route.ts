
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.name) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { username: session.user.name },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    await prisma.user.delete({
      where: { username: session.user.name },
    });
    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Error deleting account" }, { status: 500 });
  }
}
