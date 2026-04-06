import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { meetingsProcessing } from "@/inngest/functions";

// 创建 Inngest 接入的 API（可暴露多个函数处理器）
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    meetingsProcessing,
  ],
});
