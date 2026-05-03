// ─── PM2 Ecosystem Config ─────────────────────────────────────────────────────
// Used by PM2 to manage the Bajes API process on VPS
// Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/
//
// App name is derived from PM2_APP_NAME env var so staging and production
// can coexist on the same VPS without colliding.
//
// The app uses dotenv/config to load .env at startup, which works
// reliably in PM2 cluster mode (unlike Node --env-file which only
// loads in the master process).

const appName = process.env.PM2_APP_NAME || "bajes-api";

module.exports = {
  apps: [
    {
      name: appName,
      script: "./dist/server.js",
      instances: 2, // Fixed 2 instances — predictable on small VPS
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
      // These OVERRIDE values from .env file (PM2 env takes precedence)
      env_staging: {
        NODE_ENV: "production",
        PORT: 4000,
        HOST: "127.0.0.1",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4001,
        HOST: "127.0.0.1",
      },
    },
  ],
};
