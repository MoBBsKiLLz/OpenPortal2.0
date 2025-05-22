import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const invite = await prisma.invite_tokens.findUnique({
      where: { token },
    });

    if (
      !invite ||
      invite.used ||
      new Date(invite.expires_at) < new Date()
    ) {
      return NextResponse.json(
        { message: 'Invalid or expired invitation token.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        email: invite.email,
        role: invite.role,
        account_id: invite.account_id,
        region_id: invite.region_id,
        facility_id: invite.facility_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[INVITE_TOKEN_VALIDATE_ERROR]', error);
    return NextResponse.json(
      { message: 'Something went wrong while validating token.' },
      { status: 500 }
    );
  }
}
