import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  // No PrismaAdapter — credentials-only with JWT doesn't need DB sessions
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email atau Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find by email or username
        const identifier = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findFirst({
          where: identifier.includes("@")
            ? { email: identifier }
            : { username: identifier },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          isAdmin: user.isAdmin,
          emailVerified: user.emailVerified ? true : false,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        token.emailVerified = (user as { emailVerified?: boolean }).emailVerified ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { username?: string }).username = token.username as string;
        (session.user as { isAdmin?: boolean }).isAdmin = token.isAdmin as boolean;
        (session.user as { emailVerified?: boolean }).emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
};
