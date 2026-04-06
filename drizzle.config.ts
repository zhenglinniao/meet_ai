import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 生成的迁移文件输出目录
  out: "./drizzle",
  // Drizzle ORM 的 schema 定义位置
  schema: "./src/db/schema.ts",
  // 数据库类型
  dialect: "postgresql",
  dbCredentials: {
    // 数据库连接串来自环境变量
    url: process.env.DATABASE_URL!,
  },
});
