import { providerList, signIn } from "@/auth";
import { AuthError } from "next-auth";
import Image from "next/image";
import { permanentRedirect } from "next/navigation";
import { Input } from "./Input";
import { OauthButton } from "./OauthButton";
async function action(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      const params = new URLSearchParams();
      params.append("error", error.type);
      params.append("message", encodeURIComponent(error.message));
      formData.has("redirectTo") &&
        params.append("callbackUrl", formData.get("redirectTo") as string);
      return permanentRedirect(`/signin?${params.toString()}`);
    }
    throw error;
  }
}
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-[400px]  rounded-lg  border shadow-md">
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
            <OauthButton
              key={provider.id}
              id={provider.id}
              name={provider.name}
              callbackUrl={searchParams["callbackUrl"]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
