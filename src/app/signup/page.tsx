import { providerList } from "@/auth";
import { Input } from "@/components/Input";
import { OauthButton } from "@/components/OauthButton";
import { randomString } from "@/lib";
import { prisma } from "@/prisma";
import crypto from "crypto";
import { AuthError } from "next-auth";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { z, ZodError } from 'zod';

const registActionForm = z.object({
  // 账号至少6位，英文开头，只能报错字母数字下划线
  username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{5,}$/, { message: "账号只能包含字母开头，且只能包含字母数字下划线，且长度至少6位" }),
  // 密码要求：至少8位，至多30位，至少包含数字、字母、特殊字符中的两种
  password: z.string()
    .min(8, { message: '密码长度最少8位' })
    .max(30, { message: '密码长度最多30位' })
    .regex(/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}/, { message: "密码至少包含数字、字母、特殊字符中的两种" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"], // Update path to "confirmPassword"
});



/**
 * 注册服务
 * @param formData 
 */
async function registAction(formData: FormData) {
  "use server";
  try {
    const { username, password, confirmPassword } = registActionForm.parse(Object.fromEntries(formData));
    if (password !== confirmPassword) {
      throw new AuthError("两次输入的密码不一致");
    }
    const useExists = await prisma.user.count({ where: { username: username.toString() } })
    if (useExists > 0) {
      throw new AuthError("用户名已存在");
    }
    const salt = randomString(10)
    const hashPassword = crypto.createHash("md5").update(password.toString() + salt).digest("hex");
    await prisma.user.create({
      data: {
        username: username.toString(),
        password: hashPassword,
        salt,
        nickname: "NextjsBoy_" + (randomString(5)),
        image: "/logo.png"
      }
    })
    redirect("/signin", RedirectType.replace)
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect("/signup?error=" + encodeURIComponent(error.message), RedirectType.replace);
    }
    if (error instanceof ZodError) {
      const message = error.errors.map((e) => e.message ?? "").join(", ");
      return redirect("/signup?error=" + encodeURIComponent(message), RedirectType.replace);
    }
    throw error;
  }
}



export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-[400px]  rounded-lg  border shadow-md">
        <form className="flex flex-col gap-2 p-2 " action={registAction}>
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams["callbackUrl"]}
          />
          <div className="flex items-center justify-center ">
            <Image
              className="dark:invert "
              src="/logo.png"
              alt="Next.js Boy"
              width={180}
              height={38}
              priority
            />
          </div>
          <Input label="用户名" name="username" placeholder="请输入用户名" />
          <Input
            label="密码"
            name="password"
            placeholder="请输入密码"
            type="password"
          />
          <Input
            label="确认密码"
            name="confirmPassword"
            placeholder="请再次输入密码"
            type="password"
          />
          {searchParams["error"] && (
            <div className="p-2 text-red-500 text-xs">
              {searchParams["error"]}
            </div>
          )}
          <div>
            <button
              type="submit"
              className="bg-[#272e3f] hover:bg-opacity-80 w-full px-6 py-2 rounded text-white "
            >
              注册账号
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-2 p-2">
          {providerList.map((provider) => (
            <OauthButton
              key={provider.id}
              id={provider.id}
              name={provider.name}
              callbackUrl={searchParams["callbackUrl"]}
            />
          ))}
        </div>
        <a
          href="/signin"
          className="hover:text-brand underline  text-center text-sm underline-offset-4"
        >
          已有账号? 点击直接登录！
        </a>
      </div>
    </div>
  );
}
