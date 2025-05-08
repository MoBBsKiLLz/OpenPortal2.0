import { hash, compare } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  // Get user from DB
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Compare current password
  const passwordMatch = await compare(currentPassword, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ message: 'Current password is incorrect' }, { status: 403 });
  }

  // Hash new password
  const hashedPassword = await hash(newPassword, 10);

  // Update password in DB
  await prisma.users.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: 'Password updated successfully' });
}
