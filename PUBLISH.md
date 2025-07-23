# 发布到 npm 的完整流程

## 1. 准备工作

### 1.1 注册 npm 账号
如果还没有 npm 账号，请先注册：
```bash
# 访问 https://www.npmjs.com/signup 注册账号
# 或使用命令行注册
npm adduser
```

### 1.2 登录 npm
```bash
npm login
# 输入用户名、密码和邮箱
```

### 1.3 验证登录状态
```bash
npm whoami
```

## 2. 测试项目

### 2.1 构建前端资源
```bash
npm run build
```

### 2.2 本地测试
```bash
# 创建全局链接
npm link

# 测试命令
lanyuncodingui

# 测试完成后取消链接
npm unlink -g lanyuncodingui
```

## 3. 检查包名可用性

```bash
npm view lanyuncodingui
# 如果返回 404 错误，说明包名可用
```

## 4. 发布前检查

### 4.1 检查要发布的文件
```bash
npm pack --dry-run
```

### 4.2 检查包大小
```bash
npm pack
# 会生成 lanyuncodingui-1.5.0.tgz
ls -lh lanyuncodingui-*.tgz
```

## 5. 发布

### 5.1 首次发布
```bash
npm publish
```

### 5.2 更新版本发布
```bash
# 更新版本号（自动修改 package.json）
npm version patch  # 1.5.0 -> 1.5.1
npm version minor  # 1.5.0 -> 1.6.0
npm version major  # 1.5.0 -> 2.0.0

# 发布新版本
npm publish
```

## 6. 验证发布

### 6.1 检查 npm 页面
访问 https://www.npmjs.com/package/lanyuncodingui

### 6.2 测试安装
```bash
# 在其他目录测试
npx lanyuncodingui
```

## 7. 常见问题

### 7.1 权限问题
如果提示权限不足，可能是包名被占用或需要组织权限。

### 7.2 发布失败
- 检查网络连接
- 确认已登录 npm
- 检查 package.json 格式

### 7.3 包太大
- 检查 .npmignore 文件
- 确保只包含必要文件
- 使用 `npm pack` 预览

## 8. 维护

### 8.1 更新文档
- 更新 README.md 中的使用说明
- 更新版本号和更新日志

### 8.2 处理 Issues
- 定期查看 GitHub Issues
- 及时修复 bug 并发布新版本

### 8.3 版本管理
- 使用语义化版本号
- 重大更新前发布 beta 版本测试

## 完整发布命令示例

```bash
# 1. 确保代码最新
git pull origin main

# 2. 构建项目
npm run build

# 3. 更新版本
npm version patch

# 4. 发布
npm publish

# 5. 推送 git 标签
git push origin main --tags
```