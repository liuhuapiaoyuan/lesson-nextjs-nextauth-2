import { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import { AuthConfig } from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { userService } from "./app/service/user.service";
import { AdavanceNextAuth } from "./lib/auth/core";
import Authing from "./lib/auth/provider/Authing";
import Gitee from "./lib/auth/provider/Gitee";
import QQ from "./lib/auth/provider/QQ";
import WechatMp from "./lib/auth/provider/WechatMp";
import { WechatMpApi } from "./lib/auth/provider/WechatMp/WechatMpApi";
import { DBAdapterUser, IUserService } from "./lib/auth/type";
import { randomString } from "./lib/utils";
import { prisma } from "./prisma";

/**
 * 定义转换器
 */
export class UserService implements IUserService {
  async login(
    username: string,
    password: string,
    type?: "password" | "mobile"
  ): Promise<DBAdapterUser> {
    const user = await userService.login(username, password);
    if (!user) {
      throw new CredentialsSignin("账号或者密码错误");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email!,
      image: user.image,
      emailVerified: user.emailVerified,
      username: user.username!,
    };
  }
  async registUser(user: {
    username: string;
    password: string;
    formData: Record<string, string>;
  }): Promise<DBAdapterUser> {
    const { username, password, formData } = user;
    const adapterUser = await userService.createUser(username, password, {
      name: formData?.nickname ?? "NextjsBoy_" + randomString(4),
      image: formData?.image,
    });
    return {
      id: adapterUser.id,
      name: adapterUser.nickname,
      email: adapterUser.email!,
      image: adapterUser.image,
      emailVerified: adapterUser.emailVerified,
      username: adapterUser.username!,
    };
  }

  /**
   * 获得绑定的第三方数据
   */
  async listAccount(userId: string) {
    return prisma.account.findMany({
      where: {
        userId: userId,
      },
    });
  }
}

/**
 * 授权适配器
 */
export const authAdapter = PrismaAdapter(prisma);
export const wechatMpProvider = WechatMp({
  type:"QRCODE",
  wechatMpApi:new WechatMpApi()
});
/**
 * 导出如下字段：
 * signIn: 登录函数，增强后可以自动判断绑定场景/登录查经
 * signOut: 登出函数
 * auth: 授权函数
 * listAccount: 获得绑定的第三方数据
 * unBindOauthAccountInfo: 解绑第三方账号
 * handlers: 授权函数的中间件
 * regist: 账户注册函数
 * oauthProviders: 列出第三方登录提供商
 */
export const {
  signIn,
  signOut,
  listAccount,
  unBindOauthAccountInfo,
  auth,
  handlers,
  regist,
  oauthProviders,
} = AdavanceNextAuth({
  ...AuthConfig,
  providers: [GitHub, Gitee, Authing,QQ,  wechatMpProvider],
  /* 自定义绑定授权页面 */
  bindPage: "/auth/bind",
  adapter: authAdapter,
  userService: new UserService(),
});
