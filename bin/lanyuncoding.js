#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const USE_DEFAULT_PORT = process.env.USE_DEFAULT_PORT === 'true';
const PORT = USE_DEFAULT_PORT ? 3000 : process.env.PORT || Math.floor(3000 + Math.random() * 1000);

process.env.PORT = PORT;

console.log(`
╭──────────────────────────────────────────╮
│     🎨 LanYun Coding UI for Claude       │
│     Starting on port ${PORT}...          │
╰──────────────────────────────────────────╯
`);

const distPath = join(rootDir, 'dist');
if (!existsSync(distPath)) {
  console.log('📦 Building frontend...');
  const buildProcess = spawn('npm', ['run', 'build'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error('❌ Build failed');
      process.exit(1);
    }
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('🚀 Starting server...');
  
  const serverProcess = spawn('node', [join(rootDir, 'server', 'index.js')], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, PORT }
  });
  
  serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
  
  serverProcess.on('exit', (code) => {
    process.exit(code);
  });
  
  setTimeout(() => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n✨ LanYun Coding UI is running at: ${url}\n`);
    
    const platform = os.platform();
    let openCommand;
    
    if (platform === 'darwin') {
      openCommand = 'open';
    } else if (platform === 'win32') {
      openCommand = 'start';
    } else {
      openCommand = 'xdg-open';
    }
    
    spawn(openCommand, [url], {
      detached: true,
      stdio: 'ignore'
    }).unref();
  }, 2000);
  
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...');
    serverProcess.kill();
    process.exit(0);
  });
}