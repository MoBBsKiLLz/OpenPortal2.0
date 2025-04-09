import { PrismaClient } from '@prisma/client';

// Extend the global object to optionally hold a PrismaClient instance (for dev mode)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a singleton Prisma client instance
// In development, reuse the existing instance to avoid creating multiple connections
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

// Only attach to global in non-production environments to support hot reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
