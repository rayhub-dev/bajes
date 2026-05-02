import type {
  ApiErrorResponse,
  ApiMeta,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@bajes/types";

function createMeta(requestId: string, timestamp = new Date().toISOString()): ApiMeta {
  return {
    timestamp,
    requestId,
  };
}

export function ok<T>(data: T, requestId: string): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta: createMeta(requestId),
  };
}

export function fail(
  code: string,
  message: string,
  requestId: string,
  details?: Record<string, string[]>,
): ApiErrorResponse {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    meta: createMeta(requestId),
  };
}

export function paginated<T>(
  data: T[],
  pagination: PaginationMeta,
  requestId: string,
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination,
    meta: createMeta(requestId),
  };
}
