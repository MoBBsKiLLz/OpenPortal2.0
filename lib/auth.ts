// lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
