<div align="center">
  <img src="public/icons/lanyunlogo.png" alt="LanYun Coding" width="64" height="64">
  <h1>LanYun Coding</h1>
  <p>Claude Code CLI 的现代化 Web 界面</p>
</div>

[![npm version](https://img.shields.io/npm/v/lanyuncodingui.svg)](https://www.npmjs.com/package/lanyuncodingui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

为 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)（Anthropic 官方的 AI 辅助编程 CLI）提供的桌面和移动端界面。您可以在本地或远程使用它来查看 Claude Code 中的活跃项目和会话，并像使用 Claude Code CLI 一样进行修改。这为您提供了一个在任何地方都能使用的完善界面。 

## 截图

<div align="center">
  
<table>
<tr>
<td align="center">
<h3>桌面视图</h3>
<img src="public/screenshots/desktop-main.png" alt="Desktop Interface" width="400">
<br>
<em>主界面展示项目概览和聊天功能</em>
</td>
<td align="center">
<h3>移动端体验</h3>
<img src="public/screenshots/mobile-chat.png" alt="Mobile Interface" width="250">
<br>
<em>响应式移动设计，支持触摸导航</em>
</td>
</tr>
</table>



</div>

## 功能特性

- **响应式设计** - 在桌面、平板和移动设备上无缝运行，让您也能在移动端使用 Claude Code
- **交互式聊天界面** - 内置聊天界面，与 Claude Code 无缝通信
- **集成 Shell 终端** - 通过内置 Shell 功能直接访问 Claude Code CLI
- **文件浏览器** - 交互式文件树，支持语法高亮和实时编辑
- **Git 浏览器** - 查看、暂存和提交您的更改，还可以切换分支
- **会话管理** - 恢复对话、管理多个会话并跟踪历史记录


## 🚀 快速开始

无需安装！只需运行：

```bash
npx lanyuncodingui
npm install -g lanyuncodingui
```

运行 lanyuncodingui 您的浏览器将自动打开 LanYun Coding UI。

> **Windows 用户**：如果遇到安装问题，请参阅我们的 [Windows 安装指南](./WINDOWS_INSTALL.md)。

### 前置要求

- [Node.js](https://nodejs.org/) v18 或更高版本
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) - 如果未安装，将自动安装

### 全局安装

全局安装以便在任何地方使用：

```bash
npm install -g lanyuncodingui
```

如果尚未安装 Claude Code CLI，这将自动安装它。

1. **打开工具设置** - 点击侧边栏的齿轮图标
3. **选择性启用** - 仅打开您需要的工具
4. **应用设置** - 您的偏好设置将保存在本地

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*工具设置界面 - 仅启用您需要的工具*

</div>

**推荐方法**：从启用基本工具开始，根据需要添加更多工具。您随时可以调整这些设置。

## 使用指南

### 核心功能

#### 项目管理
UI 自动从 `~/.claude/projects/` 发现 Claude Code 项目并提供：
- **可视化项目浏览器** - 所有可用项目及其元数据和会话计数
- **项目操作** - 重命名、删除和组织项目
- **智能导航** - 快速访问最近的项目和会话

#### 聊天界面
- **使用响应式聊天或 Claude Code CLI** - 您可以使用适配的聊天界面，或使用 shell 按钮连接到 Claude Code CLI。
- **实时通信** - 通过 WebSocket 连接流式传输 Claude 的响应
- **会话管理** - 恢复之前的对话或开始新的会话
- **消息历史** - 完整的对话历史，包括时间戳和元数据
- **多格式支持** - 文本、代码块和文件引用

#### 文件浏览器和编辑器
- **交互式文件树** - 使用展开/折叠导航浏览项目结构
- **实时文件编辑** - 直接在界面中读取、修改和保存文件
- **语法高亮** - 支持多种编程语言
- **文件操作** - 创建、重命名、删除文件和目录

#### Git 浏览器


#### 会话管理
- **会话持久化** - 所有对话自动保存
- **会话组织** - 按项目和时间戳分组会话
- **会话操作** - 重命名、删除和导出对话历史
- **跨设备同步** - 从任何设备访问会话

### 移动应用
- **响应式设计** - 针对所有屏幕尺寸进行优化
- **触摸友好界面** - 滑动手势和触摸导航
- **移动导航** - 底部标签栏，方便拇指导航
- **自适应布局** - 可折叠侧边栏和智能内容优先级
- **添加到主屏幕快捷方式** - 将快捷方式添加到主屏幕，应用将像 PWA 一样运行

## 架构

### 系统概览

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端           │    │   后端           │    │  Claude CLI     │
│   (React/Vite)  │◄──►│ (Express/WS)    │◄──►│  集成            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 后端 (Node.js + Express)
- **Express 服务器** - RESTful API 和静态文件服务
- **WebSocket 服务器** - 用于聊天和项目刷新的通信
- **Claude CLI 集成** - 进程生成和管理
- **会话管理** - JSONL 解析和对话持久化
- **文件系统 API** - 为项目提供文件浏览器

### 前端 (React + Vite)
- **React 18** - 现代化组件架构，使用 hooks
- **CodeMirror** - 高级代码编辑器，支持语法高亮

## 发布npm 包
# 1. 提交更改
git add .
git commit -m "Fix database readonly error and optional .env loading"

# 2. 更新版本号
npm version patch

# 3. 发布
npm publish

# 4. 推送标签
git push origin main --tags

