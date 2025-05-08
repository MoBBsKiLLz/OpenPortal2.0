import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { isAfter } from 'date-fns';

// Handle POST requests to register a new user
export async function POST(req: Request) {
  try {
    // Parse the incoming request body as JSON
    const body = await req.json();
    const { token, password, first_name, last_name, phone_number } = body;

    // Validate that all required fields are provided
    if (!token || !password || !first_name || !last_name || !phone_number) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate invite token
    const invite = await prisma.invite_tokens.findUnique({ where: { token } });

    if (!invite) {
      return NextResponse.json({ message: 'Invalid or expired invite token' }, { status: 400 });
    }

    if (invite.used || isAfter(new Date(), invite.expires_at)) {
      return NextResponse.json({ message: 'Invite token has expired or already been used' }, { status: 400 });
    }

    // Check if user already exists (shouldn't normally happen)
    const existingUser = await prisma.users.findUnique({ where: { email: invite.email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the user's password for secure storage
    const hashedPassword = await hash(password, 10);

    // Create a new user record in the database
    const newUser = await prisma.users.create({
      data: {
        email: invite.email,
        password: hashedPassword,
        first_name,
        last_name,
        phone_number,
        // Generate a default username by combining first and last name
        username: `${first_name.toLowerCase()}.${last_name.toLowerCase()}`,
      },
    });

    // Find role by name
    const role = await prisma.roles.findUnique({ where: { role_name: invite.role } });

    if (!role) {
      return NextResponse.json({ message: 'Assigned role does not exist' }, { status: 400 });
    }

    // Assign user role
    await prisma.user_role.create({
      data: {
        user_id: newUser.user_id,
        role_id: role.role_id,
      },
    });

    // Mark invite as used
    await prisma.invite_tokens.update({
      where: { token },
      data: { used: true },
    });

    // Respond with a success message
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    // Log the error and respond with a generic 500 error
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
