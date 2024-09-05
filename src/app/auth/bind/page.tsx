import { loadBindAccountInfo, providerList } from "@/auth";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export default async function Page() {
  const { bindAccount, account, user } = await loadBindAccountInfo();
  if (!bindAccount || !account) {
    await redirect("/", RedirectType.replace);
  }
  const provider = providerList.find((z) => z.id === account?.provider);
  if (!provider) {
    await redirect("/", RedirectType.replace);
  }
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <style>
        {`  
.section {
    display: none;
}
.section:target {
    display: block;
}  
    
 
  `}
      </style>
      <div className="flex flex-col gap-2 p-5 w-[600px]  rounded-lg  border shadow-md">
        <div className="text-center mb-5 text-lg font-bold">
          继续以完成第三方账号绑定
        </div>
        <div className="flex items-center  justify-center gap-2 mb-5">
          <Image
            className="dark:invert rounded-full shadow"
            src="/logo.png"
            alt="NextjsBoy"
            width={50}
            height={50}
            priority
          />
          <div>{`<=>`}</div>
          <Image
            className="dark:invert rounded-full shadow"
            src={user?.image ?? "/avatar.png"}
            alt={user?.name!}
            width={50}
            height={50}
            priority
          />
        </div>
        <div className="text-center">
          <p>你已通过 {provider?.name} 授权，完善以下登录信息即可完成绑定</p>
        </div>
        <div className="flex items-center justify-center flex-col gap-2 my-2">
          <Image
            className="dark:invert rounded-full"
            src={user?.image ?? "/avatar.png"}
            alt={user?.name!}
            width={50}
            height={50}
            priority
          />
          <div>{user?.name}</div>
        </div>
        <div>
          <div id="section1" className="section">
            <LoginForm />
            <a
              href="#section2"
              className="hover:text-brand block underline  text-center text-sm underline-offset-4"
            >
              没有账号? 点击注册绑定
            </a>
          </div>
          <div id="section2" className="section">
            <SignupForm nickname={user?.name!} />
            <a
              href="#section1"
              className="hover:text-brand block underline  text-center text-sm underline-offset-4"
            >
              已有账号? 点击直接绑定
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
