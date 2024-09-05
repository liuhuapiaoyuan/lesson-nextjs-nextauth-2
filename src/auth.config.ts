import { NextAuthConfig } from "next-auth";

export const AuthConfig:NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers:[],
  pages: {
    signIn: "/auth/signin",
  },
  
}