import Image from "next/image";
import { SigninForm } from "../SigninForm";
import { SigninProviders } from "../SigninProviders";
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col gap-2 p-5 w-full bg-white md:w-[456px]  rounded-lg   shadow-md">
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
        <a
          href="/auth/signup"
          className="hover:text-blue-700 underline  text-blue-500 text-sm underline-offset-4"
        >
          没有账号? 点击注册
        </a>
        <SigninProviders callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
}
