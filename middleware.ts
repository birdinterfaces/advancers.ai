import NextAuth from "next-auth";
import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Apply middleware to these routes
    '/',
    '/:id',
    '/login',
    '/register',
    '/api/:path*',
    // Exclude the Stripe webhook endpoint
    '!/api/stripe/webhooks',
  ],
};
