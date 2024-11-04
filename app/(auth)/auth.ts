import { compare } from "bcrypt-ts";
import NextAuth, { User, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getUser, createUser } from "@/db/queries";
import { User as DbUser } from "@/db/schema";

import { authConfig } from "./auth.config";

interface ExtendedUser extends User {
  membership?: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
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
      async authorize({ email, password }: any): Promise<ExtendedUser | null> {
        let users = await getUser(email);
        if (users.length === 0) return null;
        let passwordsMatch = await compare(password, users[0].password!);
        if (passwordsMatch) {
          const user: ExtendedUser = {
            id: users[0].id,
            email: users[0].email,
            membership: users[0].membership
          };
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const users = await getUser(user.email!);
        if (users.length === 0) {
          // Create a new user if they don't exist
          await createUser(user.email!, "");
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.membership = user.membership;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.membership = token.membership;
      }
      return session;
    },
  },
});
