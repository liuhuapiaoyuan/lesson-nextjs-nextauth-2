"use client";

import { useEffect } from "react";

// 定时轮训 /api/auth/wehcatmp
async function validCode(code: string) {
  const form = new FormData();
  form.append("code", code);
  const res = await fetch("/api/auth/wechatmp", {
    method: "POST",
    body: form,
  });
  if (res.ok) {
    alert("登录成功");
    return true;
  }
  return false;
}

export function Qrcode(props: { code: string; redirectUri: string }) {
  const { redirectUri, code } = props;

  // 定时轮训 validCode
  useEffect(() => {
    const timer = setInterval(() => {
      validCode(code).then((result) => {
        if (result) {
          window.location.href = redirectUri;
          clearInterval(timer);
        }
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [code]);

  return (
    <div className="flex flex-col gap-5">
      {/* 二维码图片 */}
      <div className="p-2  bg-white border shadow">
        <img
          className="bg-white"
          height={250}
          width={250}
          src="https://cdn.kedao.ggss.club/picgo0"
          alt="二维码"
        />
      </div>
      <div className="rounded-full bg-[#232323] p-3 text-center text-white">
        扫码--》关注公众号--》回复
      </div>
      <div className="text-white text-center">
        <span>
          回复“
          <span className="text-red-500 font-bold">{code}</span>
          ”登录，60秒内有效
        </span>
      </div>
    </div>
  );
}
