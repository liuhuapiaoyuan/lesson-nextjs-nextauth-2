import { wechatMpProvider } from "@/auth";
import Image from "next/image";
import { Qrcode } from "./Qrcode";

export default async function QRCodePage(params: {
  searchParams: Record<string, string>;
}) {
  const redirect_uri = params.searchParams.redirect_uri;
  const scanResult = await wechatMpProvider.getScanUrl();
  return (
    <div className="h-screen flex-col gap-10  w-screen flex items-center justify-center ">
      <div className="flex tiems-center justify-center gap-2 text-lg">
        <Image
          width={100}
          height={100}
          className="w-6"
          alt="微信登录"
          src="/providers/wechat.svg"
        />
        <span>使用微信扫一扫登录</span>
      </div>
      <Qrcode
        qrcodeUrl={scanResult.qrcode}
        type={scanResult.type}
        code={scanResult.ticket}
        redirectUri={`${redirect_uri}?code=${scanResult.ticket}`}
      />
    </div>
  );
}
