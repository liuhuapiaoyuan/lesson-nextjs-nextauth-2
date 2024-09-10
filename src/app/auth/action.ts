"use server";
import { regist, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect, RedirectType } from "next/navigation";


export async function signInAction(formData: FormData) {
    try {
      await signIn("credentials", formData);
    } catch (error) {
      if (error instanceof AuthError) {
        const params = new URLSearchParams();
        params.append("error", error.type);
        params.append("message", encodeURIComponent(error.message));
        formData.has("redirectTo") &&
          params.append("callbackUrl", formData.get("redirectTo") as string);
        return redirect(`/signin?${params.toString()}`);
      }
      throw error;
    }
  }
  

  export async function signUpAction(formData: FormData) {
    "use server";
    try {
      await regist(formData);
      // 注册成功就去登录
      await redirect("/signin", RedirectType.replace);
    } catch (error) {
      throw error;
    }
  }
  