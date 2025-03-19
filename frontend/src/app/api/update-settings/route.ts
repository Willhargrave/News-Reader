import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: Request) {

  const { defaultArticleCount } = await request.json();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.name) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const user = await prisma.user.update({
      where: { username: session.user.name },
      data: { defaultArticleCount },
    });
    
    return NextResponse.json({
      message: "Settings updated",
      defaultArticleCount: user.defaultArticleCount,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Error updating settings" }, { status: 500 });
  }
}
