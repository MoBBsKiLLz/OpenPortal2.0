import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

// Handle POST requests to register a new user
export async function POST(req: Request) {
  try {
    // Parse the incoming request body as JSON
    const body = await req.json();
    const { email, password, first_name, last_name, phone_number } = body;

    // Validate that all required fields are provided
    if (!email || !password || !first_name || !last_name || !phone_number) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if a user with the same email already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the user's password for secure storage
    const hashedPassword = await hash(password, 10);

    // Create a new user record in the database
    await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone_number,
        // Generate a default username by combining first and last name
        username: `${first_name.toLowerCase()}.${last_name.toLowerCase()}`,
      },
    });

    // Respond with a success message
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    // Log the error and respond with a generic 500 error
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
