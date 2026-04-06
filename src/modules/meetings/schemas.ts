import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, { message: "请输入名称" }),
  agentId: z.string().min(1, { message: "请选择智能体" }),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
