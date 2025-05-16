import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role, account_ids, facility_ids, created_by } = body;

    // Basic validation
    if (!email || !role || !created_by) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prevent duplicate invites or existing users
    const existingUser = await prisma.users.findUnique({ where: { email } });
    const existingInvite = await prisma.invite_tokens.findFirst({
      where: { email, used: false },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email already exists.' },
        { status: 409 }
      );
    }

    if (existingInvite) {
      return NextResponse.json(
        { message: 'An active invitation for this email already exists.' },
        { status: 409 }
      );
    }

    // Generate secure random token
    const token = randomBytes(32).toString('hex');
    const expiresAt = addHours(new Date(), 48); // token valid for 48 hours

    // Save invitation to DB
    await prisma.invite_tokens.create({
      data: {
        token,
        email,
        role,
        account_id: account_ids?.[0] ?? null,
        facility_id: facility_ids?.[0] ?? null,
        created_by,
        expires_at: expiresAt,
      },
    });

    // Simulate sending email by logging the invite link (for now)
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register?token=${token}`;
    console.log(`📬 Invite Link: ${inviteLink}`);

    return NextResponse.json(
      { message: 'Invitation sent successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[INVITE_ERROR]', error);
    return NextResponse.json(
      { message: 'Something went wrong while sending the invite.' },
      { status: 500 }
    );
  }
}
