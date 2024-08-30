import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { AuthConfig } from "./auth.config";

const providers :Provider[]= [
  GitHub,
  credentials({
    credentials: {
      username: {},
      password: {},
    },
    async authorize(credentials) {
      if (
        typeof credentials.username==='string' &&
        credentials.username.length > 0 &&
        credentials.password == "123456qq"
      ) {
        return {
          id: "1",
          username: credentials.username,
          nickname: credentials.username,
        };
      }
      return null;
    },
  }),
];
 
export const providerList = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  providers,
});
