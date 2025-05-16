import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const accounts = await prisma.accounts.findMany({
      include: {
        region: true, // assuming `region` is the relation field
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formatted = accounts.map(account => ({
      account_id: account.account_id,
      account_name: account.name,
      phone_number: account.phone_number,
      address: account.address,
      city: account.city,
      state: account.state,
      zip: account.postal_code,
      region: account.region?.name || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('[ACCOUNTS_GET_ERROR]', error);
    return new NextResponse('Failed to load accounts', { status: 500 });
  }
}
