import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { getXataClient } from '@/lib/xata';
import type { User } from 'next-auth';
import type { UserType } from '@/types/auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        // FOR TESTING ONLY: Allow any login with email "test@example.com" and password "password"
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return {
            id: '1',
            email: 'test@example.com',
            userType: 'agent' as UserType,
            companyName: 'Test Agency',
            verificationStatus: 'verified',
          };
        }

        try {
          const xata = getXataClient();
          const user = await xata.db.users.filter({ email: credentials.email }).getFirst();

          if (!user || !user.password) {
            throw new Error('No user found');
          }

          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Ensure verificationStatus is of the correct type
          const verificationStatus = user.verificationStatus as 'pending' | 'verified' | 'rejected' | undefined;

          // Return a properly typed User object
          const baseUser = {
            id: user.id,
            email: user.email || '',
            userType: user.userType as UserType,
          };

          if (user.userType === 'agent') {
            return {
              ...baseUser,
              userType: 'agent' as const,
              companyName: user.companyName || '',
              verificationStatus: verificationStatus || 'pending',
            };
          } else {
            return {
              ...baseUser,
              userType: 'individual' as const,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
            };
          }
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed. Please try again later.');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType;
        if (user.userType === 'agent') {
          token.companyName = user.companyName;
          token.verificationStatus = user.verificationStatus;
        } else {
          token.firstName = user.firstName;
          token.lastName = user.lastName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.userType = token.userType;
        if (token.userType === 'agent') {
          session.user.companyName = token.companyName;
          session.user.verificationStatus = token.verificationStatus;
        } else {
          session.user.firstName = token.firstName;
          session.user.lastName = token.lastName;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  }
});

export { handler as GET, handler as POST };

