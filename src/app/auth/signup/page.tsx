import Image from "next/image";
import { SigninProviders } from "../SigninProviders";
import { SignupForm } from "../SignupForm";

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
    <div className="flex items-center justify-center h-screen w-full p-5 md:p-0">
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
        <SignupForm
          callbackUrl={searchParams["callbackUrl"]}
          submitText="注册账号"
        />

        <a
          href="/auth/signin"
          className="hover:text-brand underline  text-center text-sm underline-offset-4"
        >
          已经有账号? 点击登录
        </a>
        <SigninProviders callbackUrl={searchParams.callbackUrl} />
      </div>
    </div>
  );
}
