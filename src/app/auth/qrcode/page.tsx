import { wechatMpProvider } from "@/auth";
import { Qrcode } from "./Qrcode";

export default async function QRCodePage(params: {
  searchParams: Record<string, string>;
}) {
  const redirect_uri = params.searchParams.redirect_uri;
  const scanResult = await wechatMpProvider.getScanUrl();
  return (
    <div className="h-screen flex-col gap-5  w-screen flex items-center justify-center bg-[#333333]">
      <div className="text-white">微信关注登录</div>
      <Qrcode
        qrcodeUrl={scanResult.qrcode}
        type={scanResult.type}
        code={scanResult.ticket}
        redirectUri={`${redirect_uri}?code=${scanResult.ticket}`}
      />
    </div>
  );
}
