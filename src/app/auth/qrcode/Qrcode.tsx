"use client";
import { QRCodeSVG } from "qrcode.react";

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

export function Qrcode(props: {
  qrcodeUrl: string;
  type: "MESSAGE" | "QRCODE";
  code: string;
  redirectUri: string;
}) {
  const { type, qrcodeUrl, redirectUri, code } = props;

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

      {type === "MESSAGE" && (
        <>
          <div className="">
            <img
              className=""
              height={200}
              width={200}
              src={qrcodeUrl}
              alt="二维码"
            />
          </div>
          <div className="rounded-full p-3 text-center bg-white">
            扫码--》关注公众号--》回复
          </div>
          <div className=" text-center">
            <span>
              回复“
              <span className="text-red-500 font-bold">{code}</span>
              ”登录，60秒内有效
            </span>
          </div>
        </>
      )}
      {type === "QRCODE" && (
        <>
          <div className="">
            <div className="w-[200px] h-[200px]">
              <QRCodeSVG className="w-full h-full" value={qrcodeUrl} />,
            </div>
          </div>
        </>
      )}
    </div>
  );
}
