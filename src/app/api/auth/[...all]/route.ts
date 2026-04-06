import { auth } from "@/lib/auth"; // 指向你的 auth 配置文件
import { toNextJsHandler } from "better-auth/next-js";
 
export const { POST, GET } = toNextJsHandler(auth);
