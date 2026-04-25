import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let botProcess = null;
let logCallback = null;

export function startBot(botDir, onLog) {
  if (botProcess) {
    stopBot();
  }

  logCallback = onLog;

  botProcess = spawn('node', ['index.js'], {
    cwd: botDir,
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  botProcess.stdout.on('data', (data) => {
    const msg = data.toString();
    if (logCallback) logCallback({ type: 'stdout', message: msg });
  });

  botProcess.stderr.on('data', (data) => {
    const msg = data.toString();
    if (logCallback) logCallback({ type: 'stderr', message: msg });
  });

  botProcess.on('close', (code) => {
    if (logCallback) logCallback({ type: 'exit', code });
    botProcess = null;
  });

  botProcess.on('error', (err) => {
    if (logCallback) logCallback({ type: 'error', message: err.message });
    botProcess = null;
  });

  return botProcess;
}

export function stopBot() {
  if (botProcess) {
    botProcess.kill('SIGTERM');
    botProcess = null;
    if (logCallback) logCallback({ type: 'exit', code: 0, message: 'Bot stopped by user' });
  }
}

export function isBotRunning() {
  return botProcess !== null && !botProcess.killed;
}
