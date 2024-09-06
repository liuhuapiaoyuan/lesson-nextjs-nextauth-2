import NextAuth, { Account, CredentialsSignin } from "next-auth";
import { Provider } from "next-auth/providers";
import credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { AuthConfig } from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { AdapterUser } from "next-auth/adapters";
import { cookies } from "next/headers";
import { userService } from "./app/service/user.service";
import Wechat from "./lib/auth/provider/Wechat";
import { randomString } from "./lib/utils";
import { prisma } from "./prisma";

const providers: Provider[] = [
  GitHub,
  Wechat,
  credentials({
    credentials: {
      username: {},
      password: {},
    },
    async authorize(credentials) {
      if(typeof credentials.username==='string' && typeof  credentials.password==='string'){
        const {  bindAccount, account } = await loadBindAccountInfo();
        console.log("尝试账号绑定",bindAccount,account)
        const user = await userService.login(credentials.username,credentials.password)
        if(user && bindAccount && account ){
          await authAdapter.linkAccount?.({...account , userId: user.id,type:"oauth" })
          cleanBindAccountInfo();
        }
        return user
      }
      throw new CredentialsSignin("账号或者密码错误")
    },
  }),
];

export const providerList = providers
  .map((provider) => {
    if (typeof provider === "function") {
      provider = provider();
    }
    return { id: provider.id, name: provider.name };
  })
  .filter((provider) => provider.id !== "credentials");

/**
 * 授权适配器a
 */
export const authAdapter = PrismaAdapter(prisma);

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  providers,
  adapter: authAdapter,
  callbacks: {
    async signIn({ user, account, profile }) {
      if(account?.type!=='oauth'){
        return true
      }
      if (account) {
        const databseUser = await authAdapter.getUserByAccount?.({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });
        if (account && databseUser) {
          return true;
        }
      }
      const cookie = cookies()
      cookie.set("nextauth.bind.account", JSON.stringify(account))
      cookie.set("nextauth.bind.user", JSON.stringify(user))
      return "/auth/bind#section1";
    },
  },
});

type UserRegisterType = {
  username: string;
  password: string;
  nickname?: string;
  confirmPassword: string;
  redirectTo?: string;
};


/**
 * 账号注册,并自动绑定
 * @param formData 
 */
export async function register(formData:FormData){
  const { user, bindAccount, account , } = await loadBindAccountInfo();
  // 获得账号密码
  const { username, password , nickname,confirmPassword , redirectTo } = Object.fromEntries(formData) as UserRegisterType
  if(password!== confirmPassword){
    throw new CredentialsSignin("两次输入密码不一致")
  }
  // 创建账号
  const adapterUser = await userService.createUser(username, password , user ?? {
    name:nickname??"NextjsBoy_"+randomString(4)
  })
  if(bindAccount && account && user){
    await authAdapter.linkAccount?.({...account , userId: adapterUser.id,type:"oauth" })
    cleanBindAccountInfo();
    // 绑定成功自动登录
    return signIn("credentials", { username, password,redirectTo })
  }
}
function cleanBindAccountInfo() {
  const cookie = cookies();
  cookie.delete("nextauth.bind.account");
  cookie.delete("nextauth.bind.user");
}

/**
 * 从cookie获得绑定账号信息
 * @returns 
 */
export async function loadBindAccountInfo() {
  const cookie = cookies();
  try {
    const account = JSON.parse(cookie.get("nextauth.bind.account")?.value ?? "null") as Account | null;
    const user = JSON.parse(cookie.get("nextauth.bind.user")?.value ?? "null") as AdapterUser | null;
    const bindAccount = account && user;
    return { user, bindAccount, account };
    
  } catch (error) {
    return { user:null, bindAccount:false, account :null};
    
  }
  
}
