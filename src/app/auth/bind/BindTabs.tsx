"use client";

import Tabs from "@/components/ui/tabs";
import { SigninForm } from "../SigninForm";
import { SignupForm } from "../SignupForm";

export function BindTabs(props: { defaultNickname?: string }) {
  const { defaultNickname } = props;
  const tabs = [
    {
      title: "绑定老账户",
      value: "product",
      content: (
        <div className="">
          <SigninForm />
          <a
            href="#section2"
            className="hover:text-brand block underline  text-center text-sm underline-offset-4"
          >
            没有账号? 点击注册绑定
          </a>
        </div>
      ),
    },
    {
      title: "注册新账户",
      value: "services",
      content: (
        <div className="">
          <SignupForm nickname={defaultNickname} />
          <a
            href="#section1"
            className="hover:text-brand block underline  text-center text-sm underline-offset-4"
          >
            已有账号? 点击直接绑定
          </a>
        </div>
      ),
    },
  ];

  return <Tabs options={tabs} />;
}
