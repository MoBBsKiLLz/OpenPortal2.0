import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const invites = await prisma.invite_tokens.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user_created_by: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    const result = invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      created_by: invite.created_by,
      created_by_name: `${invite.user_created_by?.first_name} ${invite.user_created_by?.last_name}`,
      created_by_email: invite.user_created_by?.email,
      created_at: invite.created_at,
      expires_at: invite.expires_at,
      used: invite.used,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[INVITES_GET_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}
