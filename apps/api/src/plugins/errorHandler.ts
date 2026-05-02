import type { FastifyError, FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { fail } from "../lib/response.js";

type ErrorEnvelope = {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, string[]>;
  shouldLog: boolean;
};

function mapZodIssues(issues: ZodError["issues"]): Record<string, string[]> {
  return issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.length > 0 ? issue.path.join(".") : "root";
    const current = acc[key] ?? [];
    acc[key] = [...current, issue.message];
    return acc;
  }, {});
}

function isStatusError(error: unknown): error is FastifyError & { statusCode: number } {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as { statusCode?: unknown };
  return typeof candidate.statusCode === "number";
}

function getErrorEnvelope(error: unknown, isProduction: boolean): ErrorEnvelope {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: mapZodIssues(error.issues),
      shouldLog: false,
    };
  }

  if (isStatusError(error)) {
    const statusCode = error.statusCode;
    const isServerError = statusCode >= 500;

    return {
      statusCode,
      code: error.code ?? (isServerError ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR"),
      message: isServerError && isProduction ? "Internal server error" : error.message,
      shouldLog: isServerError,
    };
  }

  return {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    shouldLog: true,
  };
}

export async function errorHandlerPlugin(server: FastifyInstance): Promise<void> {
  const isProduction = process.env["NODE_ENV"] === "production";

  server.setErrorHandler((error, request, reply) => {
    const envelope = getErrorEnvelope(error, isProduction);

    if (envelope.shouldLog) {
      request.log.error(error);
    }

    const requestId = String(request.id);

    return reply
      .status(envelope.statusCode)
      .send(fail(envelope.code, envelope.message, requestId, envelope.details));
  });
}
