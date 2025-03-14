import NextAuth, { SessionStrategy } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials?.email!,
          password: credentials?.password!,
        });

        if (error) throw new Error(error.message);
        return data.user;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: { strategy: "jwt" as SessionStrategy }, // ✅ Fixed duplicate session key
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
