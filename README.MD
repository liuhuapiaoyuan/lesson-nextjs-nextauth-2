## 一起干翻next-auth@5.0系列(五): 集成数据库搞定注册/登录

## 前言

终于到完整集成前面课程的时刻了,我们来整理一下本次的需求:

- [x] 集成数据库登录
- [x] 自定义注册页面
- [x] 完成账户注册逻辑

## 前置知识

- 一起干翻next-auth@5.0系列(三): 授权登录集成到数据库
- 一起干翻next-auth@5.0系列(四): 自定义登录页面 UI
- prisma: 一个成熟的`Nodejs`的`ORM`工具
- sqlite: 最简单的基于文件系统的数据库

## 技术点分析

- [x] 使用`prisma`来管理`sqlite`数据库
- [x] 使用`ServerAction`来处理`账户注册逻辑`
- [x] 使用`crypto`模块来实现`Salt`加盐技术,保障账户密码安全

## 1. 引入`prisma`来快速集成数据库

这边其实很简单,一步步按照我们的教程(三)来启动就可以了.
本次我们简单的描述一下步骤:

#### 1.1 安装依赖

```shell
pnpm add @prisma/client
pnpm add -D prisma
```

#### 1.2 创建环境变量`DATABASE_URL`

为了简单,我们使用`sqlite`

```
DATABASE_URL="file:temp/dev.db"
```

#### 1.3 创建`prisma/schema.prisma`,并初始化数据库

这边 schema.prisma 文件内容如下:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String          @id @default(cuid())
  nickname          String?
  username         String?         @unique
  password         String?
  salt         String?
  image         String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

> 为了保持简洁,我们的数据库设计非常简单,但是完善.接下来我们直接初始化

```bash
pnpm  prisma migrate dev
```

#### 1.4 配置`PrismaClient`

创建文件`src/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## 2. 改造`auth.ts`,让`prisma`适配到`NextAuth`

由于`Nextjs/Middleware`不支持数据库连接,我们来拆分出`auth.config.ts`文件,让它只负责`NextAuth`的配置,而数据库的连接交给`auth.ts`来管理.

![依赖关系如上](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/auth.config.png)

#### 2.1 创建 `src/auth.config.ts`

```typescript
import { NextAuthConfig } from "next-auth";

export const AuthConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [],
  pages: {
    signIn: "/signin",
  },
};
```

#### 2.2 修改 `src/auth.ts`

现在 `auth.ts` 只提供`Adapter`的配置,其他配置从`auth.config.ts`中获取.

#### 2.3 改造`src/middleware.ts`

```typescript
import NextAuth from "next-auth";
import { AuthConfig } from "./auth.config";
/**
 * 通过拆分配置的方式，我们来解决`edge`中兼容数据库的方案
 * 具体的配置可以参考`next-auth`的文档
 * [拆分配置](https://authjs.dev/guides/edge-compatibility#split-config)
 */
export const { auth: middleware } = NextAuth(AuthConfig);
```

#### 2.4 改造`src/auth.ts`，配置数据库登录

注意：此处我们要注意对密码的加密算法,我们使用`md5`加密,并加上`salt`来保障密码安全.

```typescript
const providers: Provider[] = [
  credentials({
    credentials: {
      username: {},
      password: {},
    },
    async authorize(credentials) {
      if (
        typeof credentials.username === "string" &&
        credentials.username.length > 0 &&
        typeof credentials.password === "string" &&
        credentials.password.length > 0
      ) {
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (
          user &&
          user.password ===
            crypto
              .createHash("md5")
              .update(credentials.password + user.salt)
              .digest("hex")
        ) {
          return {
            id: user.id,
            username: user.username,
            name: user.nickname,
            image: user.image,
          };
        }
        return null;
      }
      return null;
    },
  }),
];
```

## 2. 实现注册页面以及注册接口（`ServerAction`）

#### 2.4 创建`src/app/signup/page.tsx`

页面布局代码很简单，这边不在讲解，我们重点看下注册`ServerAction`的实现
注意以下几点：

- 我们使用`FormData`来接收表单参数
- 我们是用`redirect`来对错误结果进行显示
- 是用同样的`salt`密码加密算法

```typescript
/**
 * 注册服务
 * @param formData
 */
async function registAction(formData: FormData) {
  "use server";
  try {
    const { username, password, confirmPassword } =
      Object.fromEntries(formData);
    if (password !== confirmPassword) {
      throw new AuthError("两次输入的密码不一致");
    }
    const useExists = await prisma.user.count({
      where: { username: username.toString() },
    });
    if (useExists > 0) {
      throw new AuthError("用户名已存在");
    }
    const salt = randomString(10);
    const hashPassword = crypto
      .createHash("md5")
      .update(password.toString() + salt)
      .digest("hex");
    await prisma.user.create({
      data: {
        username: username.toString(),
        password: hashPassword,
        salt,
        nickname: "NextjsBoy_" + randomString(5),
        image: "/logo.png",
      },
    });
    redirect("/signin", RedirectType.replace);
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(
        "/signup?error=" + encodeURIComponent(error.message),
        RedirectType.replace
      );
    }
    throw error;
  }
}
```

## 3. 安全改造，集成`zod`对表单进行校验

#### 3.1 安装依赖

```bash
pnpm add zod
```

#### 3.2 修改`src/app/signup/page.tsx`引入`zod`，配置`ZodSchema`

```typescript
const registActionForm = z
  .object({
    // 账号至少6位，英文开头，只能报错字母数字下划线
    username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{5,}$/, {
      message: "账号只能包含字母开头，且只能包含字母数字下划线，且长度至少6位",
    }),
    // 密码要求：至少8位，至多30位，至少包含数字、字母、特殊字符中的两种
    password: z
      .string()
      .min(8, { message: "密码长度最少8位" })
      .max(30, { message: "密码长度最多30位" })
      .regex(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}/, {
        message: "密码至少包含数字、字母、特殊字符中的两种",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"], // Update path to "confirmPassword"
  });
```

> 这里我们使用`zod`来对表单进行校验，并进行错误提示，`Zod`的是用非常容易，只要定义好 schema，然后校验数据即可.

## 项目源代码：

[查看源代码:分支-custom-ui-sqlite](https://github.com/liuhuapiaoyuan/lesson-nextjs-nextauth-2/tree/custom-ui-sqlite)

![登录页面](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/signin.png)

![注册页面](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/signup.png)

![错误提示](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/signin.error.png)

![基于zod的错误提示](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/signup.zod.png)

## 延伸探讨: 为什么又要改造`auth.ts`

> 为什么反复强调这里,因为`nextjs`的恶心机制,导致在`middleware`无法支持数据库连接,所以拆分后,我们可以独立配置数据库相关的配置.

> `Nextjs`恶心的`middleware`无法开启`nodejs runtime`的机制,在社区也有很大的探讨,但是目前暂时没有好的解决方案.我也一直在跟进官方的进度,近期,维护者有提起这个问题,并提出了在`page/route`上建立一套新的`middleware`的方案,但是目前仍然没有进度,后续我会出一篇文章重点讲解一下`nodejs runtime`和`edge runtime`有什么坑.

> [关于 middleware 的讨论(Switchable Runtime for Middleware (Allow Node.js APIs in Middleware)
> )](!https://github.com/vercel/next.js/discussions/46722#discussioncomment-10534577)

![维护者提出改善方案](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/maintainer.png)

### 即将开启项目实践： 打造符合国情的`Nextjs`统一账户中心

- [ ] 自建账号体系（包含：密码修改、账号找回）
- [ ] 是用短信验证码绑定手机号码
- [ ] 丰富的第三方登录集成：微信扫码登录、Gitee 登录、小程序扫码登录
- [ ] 完善的第三方授权的登录处理流程（绑定老账户/创建新账号）

![统一账户中心-登录](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/nextjs-uaa-oauth-login.png) 
![统一账户中心-绑定授权](https://cdn.kedao.ggss.club/markdown/nextauth-custom-ui-sqlite/nextjs-uaa-login.png)