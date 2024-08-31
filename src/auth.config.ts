import type { NextAuthConfig } from "next-auth";
import { DefaultSession } from 'next-auth';
declare module 'next-auth' {
  interface User {
    username: string; // 添加新的属性
  }

  interface Session extends DefaultSession {
    user: User;  
  }
}
const AuthConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  }, 
  providers:[], 
  pages: {
    signIn: "/signin",
  },
  /* skipCSRFCheck:skipCSRFCheck, */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username; 
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      session.user.username = token.username as string

      return session;
    },
  },
};
export { AuthConfig };

