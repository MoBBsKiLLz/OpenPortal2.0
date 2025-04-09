import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, first_name, last_name, phone_number } = body;

    if (!email || !password || !first_name || !last_name || !phone_number) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone_number,
        username: `${first_name.toLowerCase()}.${last_name.toLowerCase()}`,
      },
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
