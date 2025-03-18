import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }
  

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully', user: { id: newUser.id, username: newUser.username } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
