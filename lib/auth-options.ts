import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";
import { verifyData } from "./utils";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     return true;
  //   },
  //   async redirect({ url, baseUrl }) {
  //     return baseUrl;
  //   },
  //   async session({ session, token, user }) {
  //     return session;
  //   },
  // },
  // events: {
  //   async signIn(message) {
  //     /* on successful sign in */
  //   },
  //   async signOut(message) {
  //     /* on signout */
  //   },
  //   async createUser(message) {
  //     /* user created */
  //   },
  //   async updateUser(message) {
  //     /* user updated - e.g. their email was verified */
  //   },
  //   async linkAccount(message) {
  //     /* account (e.g. Twitter) linked to a user */
  //   },
  //   async session(message) {
  //     /* session is active */
  //   },
  // },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const user = await prisma.user
          .findUnique({
            where: {
              email: credentials!.email,
            },
          })
          .catch((err) => {
            if (err.code === "P2025")
              throw new Error(JSON.stringify({ message: "User not found" }));
          });

        if (user) {
          const matchPassword = verifyData(
            credentials!?.password,
            user.hashedPassword!
          );
          if (!matchPassword) {
            throw new Error(
              JSON.stringify({ message: "Wrong username or password" })
            );
          }
          // Any object returned will be saved in `user` property of the JWT
          return user;
        }
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
};
