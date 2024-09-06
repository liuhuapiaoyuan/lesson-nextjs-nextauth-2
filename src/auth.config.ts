import { DefaultSession, NextAuthConfig } from "next-auth";
declare module 'next-auth' {
  interface User {
    username: string; // 添加新的属性
  }

  interface Session extends DefaultSession {
    user: User; // 确保 Session 中的 user 使用扩展后的 User 类型
  }
}
export const AuthConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/signin",
  },
};
