# Windows 安装指南

## 问题说明

在 Windows 上安装 `lanyuncodingui` 时可能遇到编译错误，这是因为项目依赖的 `node-pty` 和 `better-sqlite3` 需要编译 C++ 原生模块。

## 解决方案

### 方案 1：安装编译工具（推荐）

1. **以管理员身份运行 PowerShell**

2. **安装 Windows 构建工具**
   ```powershell
   npm install --global windows-build-tools
   ```
   
   或者使用更新的方法：
   ```powershell
   npm install --global --production windows-build-tools@4.0.0
   ```

3. **如果上述方法失败，手动安装**
   - 下载并安装 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
   - 在安装时选择："Desktop development with C++" 工作负载
   - 确保包含以下组件：
     - MSVC v143 - VS 2022 C++ x64/x86 build tools
     - Windows 10 SDK

4. **安装 Python**
   ```powershell
   # 如果没有 Python，安装 Python 3
   winget install Python.Python.3
   ```

5. **重新安装 lanyuncodingui**
   ```powershell
   npm install -g lanyuncodingui
   ```

### 方案 2：使用预编译版本

如果编译仍然失败，可以尝试：

1. **清理 npm 缓存**
   ```powershell
   npm cache clean --force
   ```

2. **使用特定的 Node 版本**
   ```powershell
   # 安装 nvm-windows
   # 下载地址：https://github.com/coreybutler/nvm-windows/releases
   
   # 使用 Node 18 LTS
   nvm install 18.20.4
   nvm use 18.20.4
   ```

3. **安装时跳过可选依赖**
   ```powershell
   npm install -g lanyuncodingui --no-optional
   ```

### 方案 3：使用 npx（临时解决方案）

如果全局安装失败，可以每次使用 npx：

```powershell
npx lanyuncodingui@latest
```

### 方案 4：Docker 容器（高级用户）

创建一个 Dockerfile：

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache python3 make g++ 
RUN npm install -g lanyuncodingui
EXPOSE 3000-4000
CMD ["lanyuncodingui"]
```

运行：
```powershell
docker build -t lanyuncodingui .
docker run -p 3000:3000 lanyuncodingui
```

## 常见错误解决

### 错误：MSB8040 Spectre-mitigated libraries
这是 Visual Studio 的安全特性问题。解决方法：
1. 打开 Visual Studio Installer
2. 修改已安装的 Build Tools
3. 在"单个组件"中搜索 "Spectre"
4. 安装对应的 Spectre 缓解库

### 错误：EPERM operation not permitted
权限问题，解决方法：
1. 以管理员身份运行命令提示符
2. 关闭防病毒软件（临时）
3. 确保没有其他程序占用相关文件

### 错误：node-gyp rebuild failed
确保安装了正确的构建工具：
```powershell
npm config set msvs_version 2022
npm config set python python3
```

## 最简单的解决方案

如果上述方法都太复杂，最简单的方法是：

1. 使用 WSL2 (Windows Subsystem for Linux)
2. 在 WSL2 中安装和运行：
   ```bash
   # 在 WSL2 终端中
   npm install -g lanyuncodingui
   lanyuncodingui
   ```

## 需要帮助？

如果仍有问题，请在 GitHub Issues 中报告：
https://github.com/siteboon/claudecodeui/issues