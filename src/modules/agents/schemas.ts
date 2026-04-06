import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "请输入名称" }),
  instructions: z.string().min(1, { message: "请输入指令" }),
});

export const agentsUpdateSchema = agentsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
