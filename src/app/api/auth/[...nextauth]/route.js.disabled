import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Add user id and role to session
      if (session.user) {
        session.user.id = user?.id || token?.sub || token?.id;
        session.user.role = user?.role || token?.role || 'USER';
      }
      return session;
    },
  },
  // Add more options here if needed (callbacks, database, etc.)
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 