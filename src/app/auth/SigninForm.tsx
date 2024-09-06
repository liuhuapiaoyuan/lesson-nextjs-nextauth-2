import { Input } from "@/components/Input";
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
  return (
    <form className="flex flex-col gap-2 p-2 " action={signInAction}>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <div className="flex">
        <a
          href="#username_login"
          className="flex-1 py-2 px-4 text-center bg-gray-200 hover:bg-gray-300  target:bg-gray-500"
        >
          账号
        </a>
        <a
          href="#mobile_login"
          className="flex-1 py-2 px-4  text-center bg-gray-200 hover:bg-gray-300  target:bg-gray-500"
        >
          手机登录
        </a>
      </div>
      <div id="username_login" className="tab-item-content">
        <Input label="用户名" name="username" placeholder="请输入用户名" />
        <Input
          label="密码"
          name="password"
          placeholder="请输入密码"
          type="password"
        />
      </div>
      <div id="mobile_login" className="tab-item-content">
        <Input label="手机号码" name="mobile" placeholder="输入手机号" />
        <div className="flex items-end  gap-2">
          <div className="flex-1">
            <Input label="验证码" name="captcha" placeholder="请输入验证码" />
          </div>
          <button className="py-3 border border-gray-400 px-4 mb-2 leading-[18px] bg-[#272e3f] hover:bg-opacity-80   rounded text-white ">
            点击获取
          </button>
        </div>
        <div className="p-2 text-sm">
          注意:是用手机号码登录的新账户,会自动创建账户!
        </div>
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
