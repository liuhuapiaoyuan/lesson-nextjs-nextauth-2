import { wechatMpProvider } from "@/auth";

 

/**
 * /api/wechatmp/callback
 * @param req
 * @returns
 */
export const {POST,GET} = wechatMpProvider.handler
