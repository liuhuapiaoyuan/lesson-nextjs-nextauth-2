"use client";

import Tabs from "@/components/ui/tabs";
import { useState } from "react";
import { SigninForm } from "../SigninForm";
import { SignupForm } from "../SignupForm";

export function BindTabs(props: { defaultNickname?: string }) {
  const { defaultNickname } = props;
  const [activeTab, setActiveTab] = useState("product");
  const tabs = [
    {
      title: "绑定老账户",
      value: "product",
      content: (
        <div className="">
          <SigninForm />
          <a
            onClick={() => setActiveTab("services")}
            className="hover:text-brand cursor-pointer block underline  text-center text-sm underline-offset-4"
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
            onClick={() => setActiveTab("product")}
            className="hover:text-brand cursor-pointer block underline  text-center text-sm underline-offset-4"
          >
            已有账号? 点击直接绑定
          </a>
        </div>
      ),
    },
  ];

  return <Tabs options={tabs} activeTab={activeTab} onChange={setActiveTab} />;
}
