import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { invite_tokens } from '@prisma/client';

type FormattedInvite = {
  id: number;
  email: string;
  role: string;
  created_by: number;
  created_by_name: string;
  created_by_email: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const roles = user.user_roles.map((ur) => ur.roles.role_name);

    if (roles.includes('System Admin')) {
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

      return NextResponse.json(formatInvites(invites));
    }

    if (roles.includes('Facility Manager')) {
      return new NextResponse('Access denied', { status: 403 });
    }

    const accessibleAccounts = await prisma.user_account.findMany({
      where: { user_id: user.user_id },
      select: { account_id: true },
    });

    const accessibleFacilities = await prisma.user_facility.findMany({
      where: { user_id: user.user_id },
      select: { facility_id: true },
    });

    const invites = await prisma.invite_tokens.findMany({
      where: {
        OR: [
          { account_id: { in: accessibleAccounts.map((a) => a.account_id) } },
          { facility_id: { in: accessibleFacilities.map((f) => f.facility_id) } },
        ],
      },
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

    return NextResponse.json(formatInvites(invites));
  } catch (error) {
    console.error('[INVITES_GET_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}

function formatInvites(invites: (invite_tokens & {
  user_created_by: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
})[]): FormattedInvite[] {
  return invites.map((invite) => ({
    id: invite.id,
    email: invite.email,
    role: invite.role,
    created_by: invite.created_by,
    created_by_name: `${invite.user_created_by?.first_name ?? ''} ${invite.user_created_by?.last_name ?? ''}`,
    created_by_email: invite.user_created_by?.email ?? '',
    created_at: invite.created_at,
    expires_at: invite.expires_at,
    used: invite.used,
  }));
}