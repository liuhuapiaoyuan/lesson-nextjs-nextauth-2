import { register } from "@/auth";
import { redirect, RedirectType } from "next/navigation";
import { Input } from "../../../components/Input";

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

export function SignupForm(props: { callbackUrl?: string; nickname?: string }) {
  const { callbackUrl, nickname } = props;
  return (
    <form className="flex flex-col gap-2 p-2 " action={action}>
      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <Input
        label="昵称"
        name="nickname"
        placeholder="请输入昵称"
        defaultValue={nickname}
      />
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
      <div>
        <button
          type="submit"
          className="bg-[#272e3f] hover:bg-opacity-80 w-full px-6 py-2 rounded text-white "
        >
          注册并绑定
        </button>
      </div>
    </form>
  );
}
