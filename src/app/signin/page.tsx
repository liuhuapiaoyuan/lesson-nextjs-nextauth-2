import { providerList, signIn } from "@/auth";
import { AuthError } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Input } from "./Input";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-[400px]  rounded-lg  border shadow-md">
        <form
          className="flex flex-col gap-2 p-2 "
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", formData);
            } catch (error) {
              if (error instanceof AuthError) {
                const params = new URLSearchParams();
                params.append("error", error.type);
                params.append("message", encodeURIComponent(error.message));
                searchParams["callbackUrl"] &&
                  params.append("callbackUrl", searchParams["callbackUrl"]);
                return redirect(`/signin?${params.toString()}`);
              }
              throw error;
            }
          }}
        >
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
              登录
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-2 p-2">
          {providerList.map((provider) => (
            <form
              key={provider.name}
              action={async () => {
                "use server";
                try {
                  await signIn(provider.id, {
                    redirectTo: searchParams["callbackUrl"],
                  });
                } catch (error) {
                  // 登录可能会因为多种原因失败，例如用户不存在，或者用户没有正确的角色。
                  // 在某些情况下，你可能希望重定向到一个自定义错误页面。
                  if (error instanceof AuthError) {
                    const params = new URLSearchParams();
                    params.append("error", error.type);
                    params.append("message", encodeURIComponent(error.message));
                    searchParams["callbackUrl"] &&
                      params.append("callbackUrl", searchParams["callbackUrl"]);
                    return redirect(`/signin?${params.toString()}`);
                  }
                  // 否则，如果发生重定向，Next.js 可以处理它
                  // 所以你可以重新抛出错误，让 Next.js 处理它。
                  // Docs:
                  // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                  throw error;
                }
              }}
            >
              <button
                type="submit"
                className="bg-[#f4f7fa] w-full m-auto px-6 py-2 rounded text-foreground hover:text-background hover:bg-[#0c0620]"
              >
                <span>{provider.name}登录</span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
