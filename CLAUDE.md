
## 项目概述

Claude Code UI 是一个为 Claude Code CLI 提供图形界面的 Web 应用。它使用 React + Vite 构建前端，Express + WebSocket 构建后端，提供了完整的项目管理、文件编辑和终端集成功能。

## 常用开发命令

### 开发环境
```bash
npm run dev          # 同时启动前端和后端开发服务器
npm run client       # 仅启动前端 (Vite, 端口 3009)
npm run server       # 仅启动后端 (Express, 端口 3008)
```

### 生产构建
```bash
npm run build        # 构建前端生产版本
npm run start        # 构建并启动生产服务器
npm run preview      # 预览生产构建
```

### 测试和代码质量
项目当前没有配置测试框架或 linter。如需添加测试，建议使用 Vitest（与 Vite 兼容）或 Jest。

## 架构要点

### 前后端分离架构
- **前端**：React SPA，通过 Vite 开发服务器运行在端口 3009
- **后端**：Express 服务器运行在端口 3008，提供 API 和 WebSocket 连接
- **开发代理**：Vite 配置了代理，将 `/api`、`/ws`、`/shell` 请求转发到后端

### WebSocket 双通道设计
```javascript
// 聊天通道 - 处理 Claude 对话
ws://localhost:3008/ws

// Shell 通道 - 处理终端交互
ws://localhost:3008/shell
```

### 会话保护机制
项目实现了复杂的状态管理来防止自动项目更新打断活跃对话：
- `useSessionProtection` hook 管理会话状态
- `isSessionActive` 状态防止不必要的项目刷新
- WebSocket 消息通过 `sessionMessageHandlers` 处理

### 认证系统（可选）
- 使用 JWT + SQLite 实现
- 数据库位置：`server/data/database.sqlite`
- 认证中间件：`server/middleware/auth.js`
- 可通过环境变量完全禁用

### 关键组件结构

#### 前端核心组件
- `App.jsx`：主应用入口，管理路由和全局状态
- `ProjectsList.jsx`：项目列表管理
- `Chat.jsx`：Claude 对话界面
- `FileExplorer.jsx`：文件浏览和编辑
- `Terminal.jsx`：集成终端

#### 后端核心模块
- `server/server.js`：Express 服务器入口
- `server/claude-cli.js`：Claude CLI 集成
- `server/routes/`：API 路由定义
- `server/database/database.js`：SQLite 数据库管理

### 状态管理
- 使用 React Context API：
  - `AuthContext`：认证状态
  - `ThemeContext`：主题管理
- 组件级状态用于局部功能

### 样式系统
- Tailwind CSS 为主要样式框架
- 自定义主题配置在 `tailwind.config.js`
- 支持暗色模式，通过 `dark:` 前缀类名实现

### 文件处理
- 文件读写通过后端 API 进行
- 使用 Chokidar 监听文件变化
- 支持 CodeMirror 语法高亮编辑

## 重要注意事项

### API 端点
所有 API 请求都通过 `/api` 前缀：
- `/api/projects`：项目管理
- `/api/files`：文件操作
- `/api/claude`：Claude CLI 交互
- `/api/auth`：认证相关

### WebSocket 消息格式
```javascript
// 发送消息
{ type: 'message', content: '...', sessionId: '...' }

// 接收消息
{ type: 'response', content: '...', sessionId: '...' }
```

### 环境变量
关键环境变量在 `.env` 文件中配置：
- `PORT`：后端端口
- `VITE_PORT`：前端开发端口
- `OPENAI_API_KEY`：音频转录功能（可选）

### 依赖更新注意
- Node.js 版本要求 >= 20
- 使用 `better-sqlite3` 需要原生编译
- `sharp` 用于图标生成，可能需要平台特定二进制文件

### 调试技巧
1. 前端调试：使用浏览器开发者工具
2. 后端调试：查看服务器控制台输出
3. WebSocket 调试：使用浏览器网络面板查看 WS 消息
4. 数据库调试：使用 SQLite 客户端查看 `server/data/database.sqlite`