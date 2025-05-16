import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "../lib/prisma";

export async function getUserWithRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

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

  if (!user) return null;

  const role = user.user_roles[0]?.roles?.role_name || "N/A"; // Adjust for multiple roles if needed

  return {
    id: user.user_id,
    email: user.email,
    role,
  };
}
