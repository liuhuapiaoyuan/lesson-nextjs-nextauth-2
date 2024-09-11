
type WechatMpCaptchaManagerConfig = {
  /**
   * 过期时间
   * @default 60000 (1min)
   */
  expireTime: number;
  /**
   * 验证码长度
   * @default 6
   */
  length: number;
};
export class WechatMpCaptchaManager<T = {
  openid: string;
  unionid?: string;
}> {
  private options: WechatMpCaptchaManagerConfig;
  private cache: Map<string, { data?: T; expireAt: number; }> = new Map();

  constructor(options?: WechatMpCaptchaManagerConfig) {
    this.options = options || {
      expireTime: 60000,
      length: 6,
    };

  }

  /**
   * 生成验证码
   */
  generate(): string {
    this.cleanupExpired();
    const captcha = Math.random().toString(36).substring(2, 2 + this.options.length);
    // 放入到缓存
    this.cache.set(captcha, { expireAt: Date.now() + this.options.expireTime });
    return captcha;
  }

  /**
   * 更新验证码绑定的数据
   * @param captcha
   * @param data
   */
  complted(captcha: string, data: T): void {
    if (this.cache.has(captcha)) {
      const entry = this.cache.get(captcha);
      if (entry && entry.expireAt > Date.now()) {
        entry.data = data;
      }
    }
  }

  /**
   * 获取验证码绑定的数据
   * @param captcha
   */
  data(captcha: string) {
    const entry = this.cache.get(captcha);
    if (entry && entry.expireAt > Date.now()) {
      return entry.data;
    }
  }

  /**
   * 清理过期的验证码
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [captcha, entry] of this.cache.entries()) {
      if (entry.expireAt <= now) {
        this.cache.delete(captcha);
      }
    }
  }
}



const globalForPrisma = globalThis as unknown as {wechatMpCaptchaManager:WechatMpCaptchaManager}
 
export const wechatMpCaptchaManager = globalForPrisma.wechatMpCaptchaManager || new WechatMpCaptchaManager()
 
if (process.env.NODE_ENV !== "production") globalForPrisma.wechatMpCaptchaManager = wechatMpCaptchaManager