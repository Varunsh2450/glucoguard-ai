import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@test.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Mock authentication check
        if (credentials?.email === "demo@test.com" && credentials?.password === "password") {
          return { id: "1", name: "Dr. Demo", email: "demo@test.com" };
        }
        
        // Also allow generic login for demo purposes to prevent friction
        if (credentials?.email && credentials?.password) {
           return { id: "2", name: "Guest User", email: credentials.email };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // We map standard SignIn to our custom /login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_super_secret_for_local_dev_only_948",
});

export { handler as GET, handler as POST };
