import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.name) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ defaultArticleCount: user.defaultArticleCount });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Error fetching settings" }, { status: 500 });
  }
}
