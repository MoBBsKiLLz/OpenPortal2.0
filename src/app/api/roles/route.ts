import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const roles = await prisma.roles.findMany({
      select: {
        role_id: true,
        role_name: true,
      },
      orderBy: {
        role_id: 'asc',
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error('[GET_ROLES_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch roles.' },
      { status: 500 }
    );
  }
}
