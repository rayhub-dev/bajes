import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";

const envToLogger: Record<string, object | boolean> = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const environment = process.env["NODE_ENV"] ?? "development";

const server = Fastify({
  logger: envToLogger[environment] ?? true,
  genReqId: () => crypto.randomUUID(),
});

async function start(): Promise<void> {
  // ── Plugins ──────────────────────────────────────────────────────────────

  await server.register(cors, {
    origin: (process.env["CORS_ORIGINS"] ?? "http://localhost:3000").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  });

  await server.register(cookie);

  await server.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
    keyGenerator: (request) => {
      return request.ip;
    },
  });

  // ── Health Check ─────────────────────────────────────────────────────────

  server.get("/health", () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  server.get("/v1", () => {
    return {
      success: true,
      data: {
        name: "Bajes API",
        version: "1.0.0",
        environment,
      },
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: "init",
      },
    };
  });

  // ── Start Server ─────────────────────────────────────────────────────────

  const host = process.env["HOST"] ?? "0.0.0.0";
  const port = Number(process.env["PORT"] ?? 4000);

  try {
    await server.listen({ host, port });
    server.log.info(`Server running at http://${host}:${String(port)}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

void start();

export default server;
