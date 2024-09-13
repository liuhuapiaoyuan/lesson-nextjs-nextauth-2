"use client";

import { useState } from "react";
import { SigninForm } from "../SigninForm";
import { SignupForm } from "../SignupForm";

export function BindTabs(props: { defaultNickname?: string }) {
  const { defaultNickname } = props;
  const [activeTab, setActiveTab] = useState("singinBind");
  return (
    <>
      {activeTab === "singinBind" && (
        <>
          <SigninForm />
          <a
            onClick={() => setActiveTab("singupBind")}
            className="hover:text-brand cursor-pointer block underline  text-center text-sm underline-offset-4"
          >
            没有账号? 点击注册绑定
          </a>
        </>
      )}
      {activeTab === "singupBind" && (
        <>
          <SignupForm nickname={defaultNickname} />
          <a
            onClick={() => setActiveTab("singinBind")}
            className="hover:text-brand cursor-pointer block underline  text-center text-sm underline-offset-4"
          >
            已有账号? 点击直接绑定
          </a>
        </>
      )}
    </>
  );
}
