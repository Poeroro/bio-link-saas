import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAuthSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}
