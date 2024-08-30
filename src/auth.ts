import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { AuthConfig } from "./auth.config";

const providers = [
  credentials({
    credentials: {
      username: {},
      password: {},
    },
    async authorize(credentials) {
      if (
        credentials.username &&
        credentials.username.length > 0 &&
        credentials.password == "123456qq"
      ) {
        return {
          id: 1,
          username: credentials.username,
          nickname: credentials.username,
        };
      }
      return null;
    },
  }),
];

/**
 *  登录列表
 */
export const providerList = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  providers,
});
