import { oauthProviders } from "@/auth";
import { OauthButton } from "@/components/OauthButton";
import Image from "next/image";
import { SigninForm } from "../SigninForm";
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-[600px]  rounded-lg  border shadow-md">
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
        <SigninForm submitText="登录" callbackUrl={searchParams.callbackUrl} />
        <div className="relative">
          <div className="border-b border-gray-200 h-2 mb-2"></div>
          <div className="absolute top-0 left-0 bottom-0 flex justify-center items-center right-0">
            <span className="bg-white">OR</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {oauthProviders.map((provider) => (
            <OauthButton
              key={provider.id}
              id={provider.id}
              name={provider.name}
              callbackUrl={searchParams["callbackUrl"]}
            />
          ))}
        </div>
        <a
          href="/auth/signup"
          className="hover:text-brand underline  text-center text-sm underline-offset-4"
        >
          没有账号? 点击注册
        </a>
      </div>
    </div>
  );
}
