import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
      <p className="mt-4 text-gray-600">You are now logged in.</p>
    </div>
  );
}
