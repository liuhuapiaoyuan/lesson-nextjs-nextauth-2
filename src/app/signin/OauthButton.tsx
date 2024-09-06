import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

type OauthButtonProps = {
  id: string;
  name: string;
  callbackUrl?: string;
};

export function OauthButton(props: OauthButtonProps) {
  const { name, id, callbackUrl } = props;
  return (
    <form
      key={name}
      action={async () => {
        "use server";
        try {
          await signIn(id, {
            redirectTo: callbackUrl,
          });
        } catch (error) {
          // 登录可能会因为多种原因失败，例如用户不存在，或者用户没有正确的角色。
          // 在某些情况下，你可能希望重定向到一个自定义错误页面。
          if (error instanceof AuthError) {
            const params = new URLSearchParams();
            params.append("error", error.type);
            params.append("message", encodeURIComponent(error.message));
            callbackUrl && params.append("callbackUrl", callbackUrl);
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
        <span>{name}登录</span>
      </button>
    </form>
  );
}