


import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 随机字符串
export function randomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}   


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
