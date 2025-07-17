# 发布和使用 LanYun Coding

## 发布到 NPM 私服

### 1. 配置私服

复制 `.npmrc.example` 为 `.npmrc` 并修改配置：

```bash
cp .npmrc.example .npmrc
```

编辑 `.npmrc` 文件，设置你的私服地址：

```
registry=https://your-private-registry.com/
//your-private-registry.com/:_authToken=YOUR_AUTH_TOKEN
```

### 2. 构建和发布

```bash
# 安装依赖
npm install

# 构建项目（会自动在发布前执行）
npm run build

# 发布到私服
npm publish
```

### 3. 配置私服访问权限

如果你的私服需要特定的发布配置，可以在 `package.json` 中添加：

```json
"publishConfig": {
  "registry": "https://your-private-registry.com/"
}
```

## 使用方式

### 方式一：使用 npx（推荐）

无需全局安装，直接运行：

```bash
# 从私服运行
npx --registry https://your-private-registry.com/ lanyuncoding

# 如果已配置 .npmrc，可以直接运行
npx lanyuncoding
```

### 方式二：全局安装

```bash
# 从私服安装
npm install -g lanyuncoding --registry https://your-private-registry.com/

# 运行
lanyuncoding
```

### 方式三：作为项目依赖

```bash
# 添加到项目
npm install lanyuncoding --registry https://your-private-registry.com/

# 在 package.json scripts 中使用
{
  "scripts": {
    "ui": "lanyuncoding"
  }
}
```

## 配置选项

### 环境变量

- `PORT`: 指定服务器端口（默认：随机 3000-4000）
- `USE_DEFAULT_PORT=true`: 使用默认端口 3000
- `OPENAI_API_KEY`: 用于音频转录功能（可选）

### 运行示例

```bash
# 使用自定义端口
PORT=8080 npx lanyuncoding

# 使用默认端口
USE_DEFAULT_PORT=true npx lanyuncoding
```

## 故障排除

### 1. 权限问题

如果遇到权限错误，确保 bin 文件有执行权限：

```bash
chmod +x bin/lanyuncoding.js
```

### 2. 依赖问题

某些原生依赖（如 `better-sqlite3`、`node-pty`）可能需要编译。确保系统有必要的构建工具：

- macOS: Xcode Command Line Tools
- Linux: build-essential
- Windows: windows-build-tools

### 3. 私服连接问题

检查私服配置：

```bash
# 查看当前 registry
npm config get registry

# 验证私服连接
npm ping --registry https://your-private-registry.com/
```

## 版本更新

更新版本并发布：

```bash
# 更新版本号
npm version patch  # 或 minor/major

# 发布新版本
npm publish
```