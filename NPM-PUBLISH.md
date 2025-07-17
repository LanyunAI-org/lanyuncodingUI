# 发布 LanYun Coding 到 npm 公共仓库

## 前提条件

1. **注册 npm 账号**
   - 访问 https://www.npmjs.com/signup 注册账号
   - 或使用命令：`npm adduser`

2. **验证登录状态**
   ```bash
   npm whoami
   ```

## 发布步骤

### 1. 登录 npm

```bash
npm login
```

输入你的用户名、密码和邮箱。

### 2. 构建项目

```bash
# 安装依赖
npm install

# 构建前端（会在发布时自动执行）
npm run build
```

### 3. 测试包

发布前先本地测试：

```bash
# 创建本地包
npm pack

# 全局安装测试
npm install -g ./lanyuncoding-1.5.0.tgz

# 测试运行
lanyuncoding

# 卸载测试包
npm uninstall -g lanyuncoding
```

### 4. 发布到 npm

```bash
# 首次发布
npm publish

# 如果包名被占用，可以发布到你的组织下
npm publish --access public
```

### 5. 验证发布

```bash
# 查看包信息
npm view lanyuncoding

# 访问 npm 页面
# https://www.npmjs.com/package/lanyuncoding
```

## 版本管理

### 更新版本

```bash
# 补丁版本 (1.5.0 -> 1.5.1)
npm version patch

# 次要版本 (1.5.0 -> 1.6.0)
npm version minor

# 主要版本 (1.5.0 -> 2.0.0)
npm version major

# 发布新版本
npm publish
```

### 添加标签

```bash
# 发布 beta 版本
npm publish --tag beta

# 发布 next 版本
npm publish --tag next
```

## 用户使用方式

发布成功后，任何人都可以通过以下方式使用：

### 方式一：npx（推荐）

无需安装，直接运行：

```bash
npx lanyuncoding
```

### 方式二：全局安装

```bash
# 安装
npm install -g lanyuncoding

# 运行
lanyuncoding
```

### 方式三：作为项目依赖

```bash
# 添加到项目
npm install lanyuncoding

# 在 package.json 中使用
{
  "scripts": {
    "ui": "lanyuncoding"
  }
}
```

## 配置选项

### 环境变量

- `PORT`: 指定端口（默认随机 3000-4000）
- `USE_DEFAULT_PORT=true`: 使用默认端口 3000

```bash
# 自定义端口
PORT=8080 npx lanyuncoding

# 使用默认端口
USE_DEFAULT_PORT=true npx lanyuncoding
```

## 注意事项

1. **包名唯一性**：确保包名在 npm 上未被占用
2. **版本号**：遵循语义化版本规范 (semver)
3. **README**：确保 README.md 内容完整，这是 npm 页面的主要展示内容
4. **许可证**：确保有明确的 LICENSE 文件
5. **安全**：不要在代码中包含任何敏感信息或密钥

## 维护建议

1. **定期更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

2. **发布前检查**
   ```bash
   # 查看将要发布的文件
   npm pack --dry-run
   
   # 检查包大小
   npm publish --dry-run
   ```

3. **维护更新日志**
   - 在每次发布时更新 CHANGELOG.md
   - 在 GitHub 上创建 Release

## 故障排除

### 1. 登录问题

如果遇到登录错误：
```bash
# 清除 npm 缓存
npm cache clean --force

# 重新登录
npm login
```

### 2. 发布权限问题

如果提示没有权限：
- 确认已登录：`npm whoami`
- 确认包名未被占用
- 如果是 scoped 包，添加 `--access public`

### 3. 构建问题

如果构建失败：
- 检查 Node.js 版本（需要 >= 18）
- 删除 node_modules 重新安装
- 检查是否有原生依赖编译错误

## 撤销发布

如果需要撤销发布（仅限 72 小时内）：

```bash
npm unpublish lanyuncoding@1.5.0
```

注意：npm 不鼓励撤销发布，建议发布新版本修复问题。