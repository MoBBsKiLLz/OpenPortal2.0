import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';

// Configure authentication options for NextAuth
export const authOptions: NextAuthOptions = {
  // Use Prisma as the database adapter
  adapter: PrismaAdapter(prisma),

  // Enable credentials-based authentication (email + password)
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // Custom authorization logic for login
      async authorize(credentials) {
        // Ensure both email and password are provided
        if (!credentials?.email || !credentials?.password) return null;

        // Look up user by email
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        // If no user is found, deny access
        if (!user) return null;

        // Verify password using bcrypt
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        // Return basic user info for session/token creation
        return {
          id: user.user_id.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
        };
      },
    }),
  ],

  // Use JWT strategy for session management
  session: {
    strategy: 'jwt',
  },

  // Custom login page route
  pages: {
    signIn: '/login',
  },

  // Secret key for JWT and session encryption
  secret: process.env.NEXTAUTH_SECRET,
};
