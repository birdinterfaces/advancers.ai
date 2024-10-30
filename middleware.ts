import NextAuth from "next-auth";

import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Match all routes except the webhook endpoint
    '/((?!api/stripe/webhooks).*)',
  ],
};

