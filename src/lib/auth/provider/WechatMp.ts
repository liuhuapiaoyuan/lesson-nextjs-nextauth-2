import { AuthorizationEndpointHandler, OAuth2Config, OAuthUserConfig, UserinfoEndpointHandler } from "next-auth/providers";
import { wechatMpCaptchaManager } from "./WechatPlatformConfig";
export type WechatPlatformConfig = {
  clientId: string;
  clientSecret: string;
};
  
export type WechatMpProfile = {
  /**
   * 公众号扫码只能获得openid
   */
  openid: string
  unionid: string
}
/**
 * 微信公众号平台
 * [体验账号申请](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 * 
 * @param options 
 * @returns 
 */
export default function WeChatMp<P extends WechatMpProfile>(
  options: OAuthUserConfig<P> & WechatPlatformConfig 
): OAuth2Config<P> & { options: OAuthUserConfig<P> & WechatPlatformConfig  } {
  const {
    clientId = process.env.AUTH_WECHATMP_APP_ID!,
    clientSecret = process.env.AUTH_WECHATMP_APP_SECRET! 
  } = options ?? {}

  const authorization: AuthorizationEndpointHandler = {
    url: "http://localhost:3000/auth/qrcode",
    params: {
      appid: clientId,
      response_type: "code",
      /* 产生验证码 */
      state: wechatMpCaptchaManager.generate(),
    },
  }
 

  const userinfo: UserinfoEndpointHandler = {
    url: "http://localhost:3000/auth/qrcode2",
    async request({ tokens, provider }: any) {
      return {
        openid:tokens.openid , 
        unionid:tokens.unionid
      }
    },
  }

  const profile = (profile: WechatMpProfile) => {
    const openid = profile.unionid ?? profile.openid
    return {
      id: openid,
      name: openid,
      email: openid + "@wechat.com",
      raw: profile,
    }
  }

  return {
    id: "wechatmap",
    name: "微信公众号",
    type: "oauth",
    style: { logo: "/providers/wechatmap.png", bg: "#fff", text: "#000" },
    checks: ["none"],
    clientId,
    clientSecret,
    authorization,
    token:{
      url: "http://localhost:3000/api/auth/wechatmp/callback",
      params:{
        state:"state"
      }
    },
    userinfo,
    profile,
    options,
  }
}
