import { NextAuthConfig } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

type CallbacksType = NonNullable<NextAuthConfig['callbacks']>
export type CallbackSignInFunction = NonNullable<CallbacksType['signIn']>
export interface DBAdapterUser extends Omit<AdapterUser, "email"> {
  /**
   * 邮箱
   */
  email?: string;
  /**
   *  手机
   */
  mobile?: string;
  /**
   * 账号名
   */
  username: string;
}

// 账号登录
export interface IUserService {
  /**
   * 实现登录
   * @param username  账号/邮箱/密码
   * @param password  密码/验证码
   * @param type  登录类型，可以是password或者mobile
   */
  login(
    username: string,
    password: string,
    type?: "password" | "mobile"
  ): Promise<DBAdapterUser>;
  /**
   * 注册账号
   * @param user 
   */
  registUser(user: {
    username: string;
    password: string;
    /**
     * 表单提交的数据，比如：
     * @param nickname:string, //昵称
     * @param email:string, //邮箱
     * @param mobile:string, //手机
     */
    formData: Record<string, string>;
    /* 支持其他参数 */
  }): Promise<DBAdapterUser>;
}
