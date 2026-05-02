// ─── PM2 Ecosystem Config ─────────────────────────────────────────────────────
// Used by PM2 to manage the Bajes API process on VPS
// Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: "bajes-api",
      script: "./dist/server.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      // Environment variables per deployment
      env_staging: {
        NODE_ENV: "staging",
        PORT: 4000,
        HOST: "127.0.0.1",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
        HOST: "127.0.0.1",
      },
    },
  ],
};
