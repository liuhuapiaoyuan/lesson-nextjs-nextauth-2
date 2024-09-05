import { prisma } from "@/prisma";
import { CredentialsSignin, User } from "next-auth";


export class AccountBindError extends CredentialsSignin {
    code = "account_bind_error"
}
class UserService {
  // username  password创建账号

  comparePassword(password: string, hashedPassword: string) {
    return password === hashedPassword;
  }
  /**
   * 账号密码登录
   * @param username
   * @param password
   * @returns
   */
  public async login(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }
    if (!user.password) {
      return null;
    }
    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      return null;
    }
    return {...user,name:user.nickname};
  }
  /**
   * 创建新账户
   * @param username 
   * @param password 
   * @param nickname 
   * @returns 
   */
  public async createUser(
    username: string,
    password: string,
    user:User
  ) {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });
    if (userExists) {
      throw new Error("Username already exists");
    }
    return prisma.user.create({
      data: {
        username,
        password,
        nickname:user.name,
        email:user.email,
        image:user.image
      },
    });
  }
}


export const userService = new UserService();