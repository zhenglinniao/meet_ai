# Meet AI

一款 AI 驱动的视频会议应用，支持实时智能体、会议摘要和会后分析功能。

## 功能亮点

- AI 视频会议：支持自定义智能体
- 使用 Stream SDK 实现实时视频与聊天
- 自动生成会议摘要与转写
- 智能检索转写内容并回放视频
- 使用 Polar 进行订阅与计费
- 基于 Better Auth 的用户认证
- 移动端自适应
- 通过 Inngest 运行后台任务

## 技术栈

- Next.js 15
- React 19
- Tailwind v4
- Shadcn/ui
- tRPC
- DrizzleORM
- Neon Database
- OpenAI
- Stream Video & Chat
- Better Auth
- Inngest
- Polar

## 开发流程

```bash
# 安装依赖（React 19 需要 --legacy-peer-deps）
npm install --legacy-peer-deps

# 启动开发服务
npm run dev          # 启动 Next.js 开发服务器
npm run dev:webhook  # 启动 webhook 服务（需要在 package.json 中配置 ngrok 静态域名）
npx inngest-cli@latest dev  # 启动 Inngest 开发服务器
```

## 其它常用命令

```bash
# 数据库
npm run db:push      # 推送数据库变更
npm run db:studio    # 打开数据库管理界面

# 生产环境
npm run build        # 生产构建
npm run start        # 启动生产服务器
```

> 注意：要让 `dev:webhook` 正常工作，需要把你的 ngrok 静态域名写入 `package.json` 的脚本中：
> ```json
> "dev:webhook": "ngrok http --url=[你的_ngrok_静态域名] 3000"
> ```
