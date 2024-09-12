import { Input } from "../../components/Input";
import { signUpAction } from "./action";

export function SignupForm(props: {
  callbackUrl?: string;
  nickname?: string;
  submitText?: string;
}) {
  const { submitText = "注册并绑定", callbackUrl, nickname } = props;
  return (
    <form className="flex flex-col gap-2 p-2 " action={signUpAction}>
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
      <div className="p-2 text-gray-400 text-sm">
        我已阅读并同意 <span className="text-blue-500">服务协议</span> 和{" "}
        <span className="text-blue-500">隐私条款</span>
      </div>
      <div>
        <button
          type="submit"
          className="bg-[#272e3f] hover:bg-opacity-80 w-full px-6 py-2 rounded text-white "
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
