import { compare } from "bcrypt-ts";
import NextAuth, { DefaultSession, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getUser, createUser } from "@/db/queries";
import { User as DbUser } from "@/db/schema";

import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface User {
    membership?: string;
  }

  interface Session {
    user: {
      id: string;
      membership?: string;
    } & DefaultSession["user"]
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        let users = await getUser(email);
        if (users.length === 0) return null;
        let passwordsMatch = await compare(password, users[0].password!);
        if (passwordsMatch) {
          return {
            id: users[0].id,
            email: users[0].email,
            membership: users[0].membership,
            name: users[0].name || "",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const dbUser = await getUser(user.email!);
          if (dbUser.length === 0) {
            await createUser(
              user.email!,
              '',
              user.name || ''
            );
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.membership = user.membership;
        token.name = user.name || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.membership = token.membership as string | undefined;
        session.user.name = token.name || "";
      }
      return session;
    },
  },
});
