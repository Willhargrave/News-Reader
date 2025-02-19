import { NextResponse } from "next/server";
import { users } from "../auth/[...nextauth]/route";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const newUser = { id: uuidv4(), username, password };
    users.push(newUser);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
