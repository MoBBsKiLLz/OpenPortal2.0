import { getUserWithRole } from '@/lib/getUserWithRole'; // or wherever it's defined
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserWithRole();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}
