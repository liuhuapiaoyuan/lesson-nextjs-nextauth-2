import { Qrcode } from "./Qrcode";

export default function QRCodePage(params: {
  searchParams: Record<string, string>;
}) {
  const redirect_uri = params.searchParams.redirect_uri;
  const state = params.searchParams.state;
  return (
    <div className="h-screen flex-col gap-5  w-screen flex items-center justify-center bg-[#333333]">
      <div className="text-white">微信关注登录</div>
      <Qrcode
        code={state}
        redirectUri={`${redirect_uri}?code=${state}&state=${state}`}
      />
    </div>
  );
}
