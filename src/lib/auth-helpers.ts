import { type Session } from "next-auth";
import { auth } from "@/lib/auth";

export async function getAuthSession(): Promise<Session | null> {
  return auth();
}
