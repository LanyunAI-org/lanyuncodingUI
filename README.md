<div align="center">
  <img src="public/icons/lanyunlogo.png" alt="LanYun Coding" width="64" height="64">
  <h1>LanYun Coding</h1>
  <p>Claude Code CLI 的现代化 Web 界面</p>
</div>

[![npm version](https://img.shields.io/npm/v/lanyuncodingui.svg)](https://www.npmjs.com/package/lanyuncodingui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

为 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)（Anthropic 官方的 AI 辅助编程 CLI）提供的现代化 Web 界面。它让您可以通过直观的图形界面管理项目、查看会话历史、编辑文件，以及与 Claude 进行交互，无论您身在何处。

> 🙏 **致敬**：本项目基于 [claudecodeui](https://github.com/siteboon/claudecodeui) 改造而来。我们站在巨人的肩膀上，在原项目的优秀基础上进行了移动端适配、UI 优化和功能增强。感谢原作者的开源贡献！ 

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

## ✨ 功能特性

### 核心功能
- 🎨 **响应式设计** - 完美适配桌面、平板和移动设备，让您随时随地使用 Claude Code
- 💬 **交互式聊天界面** - 流畅的对话体验，支持代码高亮、Markdown 渲染
- 🖥️ **集成终端** - 内置 Shell 终端，直接访问 Claude Code CLI
- 📁 **文件管理** - 可视化文件树，支持实时编辑、语法高亮
- 🔀 **Git 集成** - 查看差异、暂存更改、提交代码，轻松管理版本
- 📝 **会话管理** - 智能保存对话历史，随时恢复之前的工作状态

### 相比原项目的改进
- 📱 **移动端优化** - 全新的移动端 UI 设计，触摸友好的操作体验
- 🎯 **更好的交互** - 优化的文件浏览器和编辑器，提升开发效率
- 🚀 **性能提升** - 改进的 WebSocket 通信，更快的响应速度
- 🛠️ **功能增强** - 新增 Git 浏览器、会话管理等实用功能


## 🚀 快速开始

### 一键运行（推荐）

无需安装，直接运行：

```bash
npx lanyuncodingui
```

您的默认浏览器将自动打开 LanYun Coding UI 界面。

### 全局安装

如果您想在任何地方使用，可以全局安装：

```bash
npm install -g lanyuncodingui
lanyuncodingui
```

> 💡 **提示**：如果尚未安装 Claude Code CLI，我们会自动为您安装。

### 系统要求

- **Node.js** v18 或更高版本
- **Claude Code CLI** - 将自动检测并安装
- **现代浏览器** - Chrome、Firefox、Safari、Edge 等

> 🪟 **Windows 用户**：暂时不支持windows系统，敬请期待

## 📖 使用指南

### 初始设置

1. **启动应用** - 运行 `lanyuncodingui` 后，浏览器会自动打开
2. **配置工具** - 点击侧边栏的齿轮图标，选择您需要的工具
3. **开始对话** - 在聊天界面输入您的需求，Claude 会协助您编程

> 💡 **建议**：从基本工具开始，根据需要逐步启用更多功能

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

## 🏗️ 技术架构

### 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web 前端      │    │   Node.js 后端  │    │  Claude Code    │
│   React + Vite  │◄──►│ Express + WS    │◄──►│     CLI         │
│   Tailwind CSS  │    │   SQLite DB     │    │   (子进程)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        ↑                        ↑                      ↑
        └────────────────────────┴──────────────────────┘
                    WebSocket 实时通信
```

### 技术栈

#### 前端
- **React 18** - 现代化的组件化开发
- **Vite** - 极速的开发服务器和构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **CodeMirror 6** - 强大的代码编辑器
- **WebSocket** - 实时双向通信

#### 后端
- **Express.js** - 轻量级 Web 服务框架
- **WebSocket (ws)** - 原生 WebSocket 支持
- **SQLite** - 轻量级数据库存储
- **Child Process** - Claude CLI 进程管理
- **Chokidar** - 文件系统监控

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是提交 Bug 报告、功能建议还是代码贡献。

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/LanyunAI-org/lanyuncodingUI.git
cd ccui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 提交 PR 前请确保

- 代码通过所有测试
- 遵循项目的代码规范
- 更新相关文档

## 📦 发布流程

维护者发布新版本的步骤：

```bash
# 1. 提交所有更改
git add .
git commit -m "您的提交信息"

# 2. 更新版本号
npm version patch  # 或 minor/major

# 3. 发布到 npm
npm publish

# 4. 推送代码和标签
git push origin main --tags
```

## 🙏 鸣谢

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) - Anthropic 的官方 AI 编程助手
- [claudecodeui](https://github.com/siteboon/claudecodeui) - 本项目的基础，感谢原作者的开源精神
- 所有贡献者和用户的支持与反馈

---

<div align="center">
  <p>如果这个项目对您有帮助，请给我们一个 ⭐️</p>
  <p>Made with ❤️ by LanYun Team</p>
</div>

