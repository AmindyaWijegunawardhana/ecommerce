const { spawn } = require('child_process');
const path = require('path');

console.log('✨ Starting Rashi Dreamy Gifts MERN application...');

// 1. Start Express Backend Server
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  shell: true,
  stdio: 'inherit'
});

// 2. Start Vite Frontend Development Client
const clientProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  shell: true,
  stdio: 'inherit'
});

// Coordinate termination of child processes on exit
const cleanExit = () => {
  console.log('\nStopping servers...');
  serverProcess.kill('SIGINT');
  clientProcess.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
