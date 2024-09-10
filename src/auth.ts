import { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import { AuthConfig } from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { userService } from "./app/service/user.service";
import { AdavanceNextAuth } from "./lib/auth/core";
import Wechat from "./lib/auth/provider/Wechat";
import { DBAdapterUser, IUserService } from "./lib/auth/type";
import { randomString } from "./lib/utils";
import { prisma } from "./prisma";



/**
 * 定义转换器
 */
export class UserService implements IUserService{
  async login(username: string, password: string, type?: "password" | "mobile"): Promise<DBAdapterUser> {
    const user = await  userService.login(username,password)
    if (!user) {
      throw new CredentialsSignin("账号或者密码错误")
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email!,
      image: user.image,
      emailVerified: user.emailVerified,
      username: user.username!,
    }
  }
  async registUser(user: { username: string; password: string; formData: Record<string, string>; }): Promise<DBAdapterUser> {
     const { username, password, formData } = user
    const adapterUser = await userService.createUser(username, password , {
      name:formData?.nickname??"NextjsBoy_"+randomString(4) ,
      image:formData?.image
    })
    return {
      id: adapterUser.id,
      name: adapterUser.nickname,
      email: adapterUser.email!,
      image: adapterUser.image,
      emailVerified: adapterUser.emailVerified,
      username: adapterUser.username!,
    }
    
  }

}

 
/**
 * 授权适配器a
 */
export const authAdapter = PrismaAdapter(prisma);

export const { signIn, signOut, unBindOauthAccountInfo,auth, handlers ,regist  , oauthProviders} = AdavanceNextAuth({
  ...AuthConfig,
  providers:[
    GitHub,
    Wechat, 
  ],
  adapter: authAdapter, 
  userService:new UserService()
});

 
 