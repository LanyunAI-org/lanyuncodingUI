import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';

const router = express.Router();

// Helper function to read shell configuration files
async function readShellConfig() {
  const shell = process.env.SHELL || '/bin/bash';
  const homeDir = os.homedir();
  let configFile;
  
  if (shell.includes('zsh')) {
    configFile = path.join(homeDir, '.zshrc');
  } else if (shell.includes('bash')) {
    configFile = path.join(homeDir, '.bashrc');
  } else {
    configFile = path.join(homeDir, '.profile');
  }
  
  try {
    const content = await fs.readFile(configFile, 'utf8');
    return { configFile, content };
  } catch (error) {
    return { configFile, content: '' };
  }
}

// Helper function to write shell configuration files
async function writeShellConfig(configFile, content) {
  try {
    await fs.writeFile(configFile, content, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing shell config:', error);
    return false;
  }
}

// Extract environment variables from shell config
function extractEnvVars(content, varNames) {
  const envVars = {};
  
  varNames.forEach(varName => {
    const regex = new RegExp(`export\\s+${varName}=(.+)`, 'g');
    const match = regex.exec(content);
    if (match) {
      let value = match[1].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      envVars[varName] = value;
    }
  });
  
  return envVars;
}

// Get current environment variables
router.get('/', async (req, res) => {
  try {
    const { configFile, content } = await readShellConfig();
    const envVars = extractEnvVars(content, ['ANTHROPIC_BASE_URL', 'ANTHROPIC_API_KEY']);
    
    res.json({ 
      success: true, 
      envVars,
      configFile
    });
  } catch (error) {
    console.error('Error reading environment variables:', error);
    res.status(500).json({ error: 'Failed to read environment variables' });
  }
});

// Set environment variables
router.post('/', async (req, res) => {
  try {
    const { envVars } = req.body;
    const { configFile, content } = await readShellConfig();
    
    let newContent = content;
    
    // Process each environment variable
    Object.entries(envVars).forEach(([key, value]) => {
      const regex = new RegExp(`export\\s+${key}=.*$`, 'gm');
      
      if (value === '' || value === null || value === undefined) {
        // Remove the environment variable if value is empty
        newContent = newContent.replace(regex, '');
        // Also remove any standalone lines that might be left
        newContent = newContent.replace(new RegExp(`^\\s*${key}\\s*=.*$`, 'gm'), '');
      } else {
        const exportLine = `export ${key}=${value}`;
        
        if (regex.test(newContent)) {
          // Replace existing
          newContent = newContent.replace(regex, exportLine);
        } else {
          // Add new
          // Find Claude Code environment variables section or create it
          const sectionMarker = '# Claude Code environment variables';
          const sectionIndex = newContent.indexOf(sectionMarker);
          
          if (sectionIndex !== -1) {
            // Add after the section marker
            const lines = newContent.split('\n');
            let insertIndex = -1;
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(sectionMarker)) {
                insertIndex = i + 1;
                break;
              }
            }
            if (insertIndex !== -1) {
              lines.splice(insertIndex, 0, exportLine);
              newContent = lines.join('\n');
            }
          } else {
            // Add new section at the end
            newContent += '\n\n# Claude Code environment variables\n' + exportLine;
          }
        }
      }
    });
    
    // Clean up empty lines and sections
    newContent = newContent.replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newlines

    // Remove section marker if it's empty (no export statements following it)
    newContent = newContent.replace(/# Claude Code environment variables\s*\n+(?=\n|$)/g, '');

    // Remove any trailing whitespace and ensure file ends with single newline
    newContent = newContent.replace(/\s+$/, '\n');
    
    // Write back to file
    const success = await writeShellConfig(configFile, newContent);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Environment variables updated successfully',
        configFile
      });
    } else {
      res.status(500).json({ error: 'Failed to write configuration file' });
    }
  } catch (error) {
    console.error('Error setting environment variables:', error);
    res.status(500).json({ error: 'Failed to set environment variables' });
  }
});

// Test Kimi K2 API connection
router.post('/test', async (req, res) => {
  try {
    const { apiKey, baseUrl } = req.body;
    
    // Test the connection using Anthropic Messages API format
    // Kimi K2 provides an Anthropic-compatible endpoint
    const testUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const response = await fetch(`${testUrl}v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: 'Hi, just testing the connection. Reply with "Connection successful!"'
          }
        ],
        max_tokens: 50
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      res.json({
        success: true,
        message: 'Successfully connected to Lanyun K2 API',
        details: 'API connection verified. You can now use Lanyun K2 with Claude Code.'
      });
    } else {
      const errorText = await response.text();
      let errorMessage = `Failed to connect: ${response.status} ${response.statusText}`;
      
      // Parse error details if possible
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorMessage = errorData.error.message || errorData.error || errorMessage;
        }
      } catch (e) {
        // Use raw error text if not JSON
      }
      
      res.json({
        success: false,
        message: errorMessage,
        details: errorText
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: 'Failed to connect to Kimi K2 API',
      details: error.message
    });
  }
});

export default router;