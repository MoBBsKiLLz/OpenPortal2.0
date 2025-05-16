import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { accountIds } = await req.json();

    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      return new NextResponse('Invalid accountIds provided', { status: 400 });
    }

    const facilities = await prisma.facilities.findMany({
      where: {
        account_id: { in: accountIds },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = facilities.map((facility) => ({
      facility_id: facility.facility_id,
      facility_name: facility.name,
      account_id: facility.account_id,
      phone_number: facility.phone_number,
      address: facility.address,
      city: facility.city,
      state: facility.state,
      zip: facility.postal_code,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[FACILITIES_POST_ERROR]', error);
    return new NextResponse('Failed to fetch facilities', { status: 500 });
  }
}
