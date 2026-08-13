module.exports = {
  apps: [
    {
      name: 'cwi-fe',
      cwd: 'D:\\CWI\\source4',
      script: 'C:\\Windows\\System32\\cmd.exe',
      args: '/c npx vite preview --host 0.0.0.0 --port 5275',
      interpreter: 'none',
      watch: false,
      autorestart: true,
    },
  ],
}