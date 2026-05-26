import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { type Session } from "next-auth";

export async function requireAdmin(): Promise<Session> {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function getAdminSession(): Promise<Session | null> {
  const session = await getAuthSession();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) return null;
  return session;
}
