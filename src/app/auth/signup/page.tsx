import { providerList, register } from "@/auth";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { Input } from "../../../components/Input";
import { OauthButton } from "../../../components/OauthButton";

async function action(formData: FormData) {
  "use server";
  try {
    await register(formData);
    // 注册成功就去登录
    await redirect("/signin", RedirectType.replace);
  } catch (error) {
    throw error;
  }
}

/**
 * 账号注册
 * @param param0
 * @returns
 */
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-[600px]  rounded-lg  border shadow-md">
        <form className="flex flex-col gap-2 p-2 " action={action}>
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
              {searchParams["error"]}:
              {decodeURIComponent(searchParams["message"])}
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
          已经有账号? 点击登录
        </a>
      </div>
    </div>
  );
}
