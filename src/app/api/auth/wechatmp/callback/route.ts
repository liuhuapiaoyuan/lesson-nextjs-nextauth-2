import { wechatMpCaptchaManager } from "@/lib/auth/provider/WechatPlatformConfig";
import { NextRequest } from "next/server";

export function GET() {
  return Response.json({ message: "success" });
}

/**
 * /api/wechatmp/callback
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const text = await req.text();
  console.log("接收到内容", text,searchParams);
  if (searchParams.has("state")) {
    const state = searchParams.get("state");
    const data = await wechatMpCaptchaManager.data(state?.toString()!) 
    return Response.json({
      message: "success",
      tokens: {
        openid: "测试openid"+  state,
        unionid: "测试unionid"+  state,
      },
      access_token: "xxxxx",
      token_type: "bearer",
    });
  }

  // 这边就是回复微信的消息 登录成功
  return Response.json({
    message: "success",
    access_token: "xxxxx",
    token_type: "bearer",
  });
}
