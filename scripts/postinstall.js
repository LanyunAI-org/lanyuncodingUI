#!/usr/bin/env node

import { execSync } from 'child_process';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Skip postinstall when running via npx
if (process.env.npm_config_global !== 'true') {
  process.exit(0);
}

console.log('\n🔍 Checking for Claude Code CLI...');

try {
  // Check if claude-code is already installed globally
  execSync('claude version', { stdio: 'ignore' });
  console.log('✅ Claude Code CLI is already installed\n');
} catch (error) {
  console.log('⚠️  Claude Code CLI not found');
  console.log('📦 Installing Claude Code CLI globally...\n');
  
  try {
    // Install claude-code globally
    execSync('npm install -g @anthropic-ai/claude-code', { 
      stdio: 'inherit',
      shell: true 
    });
  } catch (installError) {
    console.error('\n❌ Failed to install Claude Code CLI automatically');
    console.error('Please install it manually with: npm install -g @anthropic-ai/claude-code');
    console.error('Or visit: https://docs.anthropic.com/en/docs/claude-code\n');
    // Don't exit with error - allow the UI installation to continue
  }
}