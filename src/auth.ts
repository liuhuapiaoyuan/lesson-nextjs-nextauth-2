import crypto from "crypto";
import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import credentials from "next-auth/providers/credentials";
import { AuthConfig } from "./auth.config";
import { prisma } from "./prisma";
const providers: Provider[] = [
  credentials({
    credentials: {
      username: {},
      password: {},
    },
    async authorize(credentials) {
      if (
        typeof credentials.username === 'string' &&
        credentials.username.length > 0 &&
        typeof credentials.password === 'string' &&
        credentials.password.length > 0
      ) {
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        })

        if (user && user.password === (crypto
          .createHash("md5")
          .update(credentials.password + user.salt)
          .digest("hex"))) {
          return {
            id: user.id,
            username: user.username!,
            name: user.nickname,
            image: user.image
          }
        }
        return null;
      }
      return null;
    },
  }),
];


export const providerList = providers
  .map((provider) => {
    if (typeof provider === "function") {
      provider = provider()
    }
    return { id: provider.id, name: provider.name }
  })
  .filter((provider) => provider.id !== "credentials")


export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  providers,
});
