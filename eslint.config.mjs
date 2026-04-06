import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// 将 ESM 的 URL 转成文件路径，便于兼容旧版 ESLint 配置
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 兼容旧的 ESLint 配置格式
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 继承 Next.js 推荐规则
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^(body|signature|normalizeOpenAiUrl|parseOpenAiHeaders|polar|checkout|portal|polarClient)$",
          argsIgnorePattern: "^_",
          vars: "all",
        },
      ],
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
