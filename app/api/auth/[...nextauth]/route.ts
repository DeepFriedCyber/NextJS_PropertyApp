import NextAuth from "next-auth/next";
import type { NextAuthOptions, Session as NextAuthSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

// Define a more specific user type
interface CustomUser {
  id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
}

// Define a more specific session type
interface Session extends NextAuthSession {
  user: CustomUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          const user = userCredential.user;

          if (!user) {
            throw new Error("No user found");
          }

          // Return the user object that NextAuth expects
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub || null,
          name: session.user?.name || null,
          email: session.user?.email || null,
          image: session.user?.image || null,
        }
      } as Session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
