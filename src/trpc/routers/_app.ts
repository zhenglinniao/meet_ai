import { agentsRouter } from '@/modules/agents/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
});
// 导出 API 的类型定义，供前端推断类型使用
export type AppRouter = typeof appRouter;
