import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) {
          // For demo purposes, create user on first login
          const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
          const email = credentials.email as string;
          const newUser = await db.insert(users).values({
            email: email,
            name: email.split('@')[0],
          }).returning();

          return {
            id: newUser[0].id,
            email: newUser[0].email,
            name: newUser[0].name,
          };
        }

        // In production, you'd verify the password here
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id!),
        });
        token.role = dbUser?.role || 'trainee';
      }
      return token;
    }
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/onboarding',
  },
  session: {
    strategy: 'jwt',
  },
});