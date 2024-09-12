import { Input } from "@/components/Input";
import Tab from "@/components/ui/tabs";
import { signInAction } from "./action";

/**
 * 登录表单
 * @param props
 * @returns
 */
export function SigninForm(props: {
  callbackUrl?: string;
  submitText?: React.ReactNode;
}) {
  const { callbackUrl, submitText } = props;
  const tabs = [
    {
      title: "密码登录",
      value: "password",
      content: (
        <>
          <Input label="用户名" name="username" placeholder="请输入用户名" />
          <Input
            label="密码"
            name="password"
            placeholder="请输入密码"
            type="password"
          />
        </>
      ),
    },
    {
      title: "验证码登录",
      value: "mobile",
      content: (
        <>
          <Input label="手机号码" name="mobile" placeholder="输入手机号" />
          <div className="flex items-end  gap-2">
            <div className="flex-1">
              <Input
                label="验证码登录"
                name="captcha"
                placeholder="请输入验证码"
              />
            </div>
            <button className="py-3 border border-gray-400 px-4 mb-2 leading-[18px]  hover:border-[#272e3f]   rounded   ">
              发送验证码
            </button>
          </div>
        </>
      ),
    },
  ];
  return (
    <form className="flex flex-col gap-2 p-2 " action={signInAction}>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <Tab options={tabs} />
      <div className="p-2 text-gray-400 text-sm">
        我已阅读并同意 <span className="text-blue-500">服务协议</span> 和{" "}
        <span className="text-blue-500">隐私条款</span>
      </div>
      <div>
        <button
          type="submit"
          className="bg-[#272e3f] hover:bg-opacity-80 w-full px-6 py-2 rounded text-white "
        >
          {submitText ?? "登录并绑定"}
        </button>
      </div>
    </form>
  );
}
