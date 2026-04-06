import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * 参考：https://trpc.io/docs/server/context
   */
  // 这里返回的对象会注入到每个 procedure 的 ctx 中
  return { userId: 'user_123' };
});
// 避免直接导出 t 对象：
// 1) 命名不直观
// 2) 在 i18n 等场景中 t 变量非常常见，容易混淆
const t = initTRPC.create({
  /**
   * 参考：https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// 基础 router 与 procedure 工具
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  // 从请求头中读取会话信息，未登录则抛出错误
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({ ctx: { ...ctx, auth: session } });
});
export const premiumProcedure = (entity: "meetings" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    // 本地开发未配置 POLAR_ACCESS_TOKEN 时，直接按免费用户处理
    if (!process.env.POLAR_ACCESS_TOKEN) {
      return next({ ctx: { ...ctx, customer: null } });
    }

    // 查询 Polar 订阅状态，用于判断是否为付费用户
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    // 统计当前用户已创建的会议/智能体数量
    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    const isPremium = customer.activeSubscriptions.length > 0;
    const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS;
    const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

    // 根据调用入口判断是否需要限制
    const shouldThrowMeetingError =
      entity === "meetings" && isFreeMeetingLimitReached && !isPremium;
    const shouldThrowAgentError =
      entity === "agents" && isFreeAgentLimitReached && !isPremium;

    if (shouldThrowMeetingError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free meetings",
      });
    }

    if (shouldThrowAgentError) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You have reached the maximum number of free agents",
      });
    }

    // 透传 Polar 客户信息，供后续 procedure 使用
    return next({ ctx: { ...ctx, customer } });
  });
