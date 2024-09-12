import crypto from "crypto";
import {
  AuthorizationEndpointHandler,
  OAuth2Config,
  OAuthUserConfig,
  UserinfoEndpointHandler,
} from "next-auth/providers";
import { NextRequest } from "next/server";
import { WechatMpCaptchaManager } from "./WechatPlatformConfig";


const globalForPrisma = globalThis as unknown as {wechatMpCaptchaManager:WechatMpCaptchaManager}
 
export const wechatMpCaptchaManager = globalForPrisma.wechatMpCaptchaManager || new WechatMpCaptchaManager()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.wechatMpCaptchaManager = wechatMpCaptchaManager


export type WechatPlatformConfig = {
  clientId: string;
  clientSecret: string;
  /* 解密密钥*/
  encoderAESKey?: string;
  /* 消息令牌 */
  token: string;
};

export type WechatMpProfile = {
  /**
   * 公众号扫码只能获得openid
   */
  openid: string;
  unionid: string;
};

export function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string,
  token: string
) {
  const tmpArr = [token, timestamp, nonce];
  tmpArr.sort();
  const tmpStr = tmpArr.join("");
  const hash = crypto.createHash("sha1").update(tmpStr).digest("hex");
  return hash === signature;
}
/**
 * 仅处理微信公众号消息的xml
 * @param xml
 * @returns
 */
function parseWehcatMessageXML<T>(xml: string) {
  const result: Record<string, string> = {};
  // 匹配 XML 标签及其内容
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const [, tag, content] = match;
    // 处理 CDATA
    const cleanContent = content.replace(/^<!\[CDATA\[|\]\]>$/g, "");
    result[tag] = cleanContent;
  }

  return result as T;
}

/**
 * 处理Nextjs的GET/POST请求
 */
async function handler(req: NextRequest, token: string) {
  const searchParams = req.nextUrl.searchParams;
  const signature = searchParams.get("signature");
  const echostr = searchParams.get("echostr");
  const timestamp = searchParams.get("timestamp");
  const nonce = searchParams.get("nonce");
  if (req.method == "GET" ) {
    if (
      signature &&
      echostr &&
      timestamp &&
      nonce &&
      checkSignature(signature, timestamp, nonce, token)
    ) {
      return new Response(echostr, { status: 200 });
    }
    return new Response("Invalid signature", { status: 401 });
  }
  // 判断消息类型 如果是表单类型
  const isFormData = req.headers.get("Content-Type")?.includes("form")
  if (isFormData) {
    const formData = await req.formData();
    const code = formData.get("code");
    const data = await wechatMpCaptchaManager.data(code?.toString()!);
    if(!data){
      return new Response("Invalid state", { status: 401 });
    }
    return Response.json({
      scope:"openid",
      access_token: data.openid,
      token_type: "bearer",
    });
  } else {
    if (
      !(
        signature &&
        timestamp &&
        nonce &&
        checkSignature(signature, timestamp, nonce, token)
      )
    ) {
      return new Response("Invalid signature", { status: 401 });
    }
    const xml = await req.text();
    // 文本消息
    const message = parseWehcatMessageXML<{
      FromUserName: string;
      ToUserName: string;
      MsgType: string;
      Content: string;
      MsgId: string;
    }>(xml);
    // 
    const status = await wechatMpCaptchaManager.complted(message.Content,{
      openid: message.FromUserName
    })
    return new Response(
      `<xml>
  <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
  <CreateTime>${Math.floor(Date.now()/1000)}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${status?"登录成功":"登录失败,请重新获得验证码"}]]></Content>
</xml>
`,
      { status: 200, headers:{"Content-Type": "text/xml"} }
    );
  }
}

/**
 * 微信公众号平台
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 *
 * @param options
 * @returns
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options?: OAuthUserConfig<P> & WechatPlatformConfig
): OAuth2Config<P> & { 
  handler:{
    GET: (req:NextRequest)=>Promise<Response>,
    POST: (req:NextRequest)=>Promise<Response> , 
    
  }
  options?: OAuthUserConfig<P> & WechatPlatformConfig } {
  const {
    clientId = process.env.AUTH_WECHATMP_APP_ID!,
    clientSecret = process.env.AUTH_WECHATMP_APP_SECRET!,
    encoderAESKey = process.env.AUTH_WECHATMP_ENCODER_AESKEY,
    token = process.env.AUTH_WECHATMP_TOKEN!,
    // 令牌 开发者ID，开发者密码，消息加解密密钥
  } = options ?? {};

  const authorization: AuthorizationEndpointHandler = {
    url: "http://localhost:3000/auth/qrcode",
    params: {
      appid: clientId,
      response_type: "code",
      /* 产生验证码 */
      state: wechatMpCaptchaManager.generate(),
    },
  };

  const userinfo: UserinfoEndpointHandler = {
    url: "http://localhost:3000/auth/qrcode2",
    async request({ tokens }: any) {
      return {
        openid: tokens.access_token,
      };
    },
  };

  const profile = (profile: WechatMpProfile) => {
    const openid = profile.unionid ?? profile.openid;
    return {
      id: openid,
      name: openid,
      email: openid + "@wechat.com",
      raw: profile,
    };
  };

  return {
    id: "wechatmp",
    name: "微信公众号关注",
    type: "oauth",
    style: { logo: "/providers/wechatmp.png", bg: "#fff", text: "#000" },
    checks: ["none"],
    clientId,
    clientSecret,
    authorization,
    token: {
      url: "http://localhost:3000/api/auth/wechatmp",
    },
    userinfo,
    profile,
    options,
    handler:{
      GET:(req:NextRequest)=>handler(req,token),
      POST:(req:NextRequest)=>handler(req,token)  
    },
  };
}
