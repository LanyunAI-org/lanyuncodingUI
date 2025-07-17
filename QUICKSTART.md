# LanYun Coding 快速开始

## 立即使用（无需安装）

```bash
npx lanyuncoding
```

就这么简单！浏览器会自动打开 LanYun Coding UI。

## 本地测试

在发布前先本地测试：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 本地测试 CLI
node bin/lanyuncoding.js
```

## 发布到私服

1. 配置私服（参见 PUBLISH.md）
2. 发布：`npm publish`
3. 使用：`npx lanyuncoding`

## 特性

- ✨ 自动构建前端资源
- 🚀 自动启动服务器
- 🌐 自动打开浏览器
- 📦 支持 npx 直接运行
- 🔒 支持私服发布