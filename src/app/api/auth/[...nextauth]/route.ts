import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create the NextAuth handler using the shared authOptions configuration
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST methods
// Required for Next.js App Router API routing
export { handler as GET, handler as POST };
