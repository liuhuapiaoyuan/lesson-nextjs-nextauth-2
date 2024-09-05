import { signIn } from "@/auth";
import { Input } from "@/components/Input";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
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
      return redirect(`/signin?${params.toString()}`);
    }
    throw error;
  }
}
export function LoginForm(props: { callbackUrl?: string }) {
  const { callbackUrl } = props;
  return (
    <form className="flex flex-col gap-2 p-2 " action={action}>
      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <Input label="用户名" name="username" placeholder="请输入用户名" />
      <Input
        label="密码"
        name="password"
        placeholder="请输入密码"
        type="password"
      />
      <div>
        <button
          type="submit"
          className="bg-[#272e3f] hover:bg-opacity-80 w-full px-6 py-2 rounded text-white "
        >
          登录并绑定
        </button>
      </div>
    </form>
  );
}
