// ─── API Response Format ─────────────────────────────────────────────────────

export interface ApiMeta {
  timestamp: string;
  requestId: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error: null;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  data: null;
  error: ApiErrorDetail;
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
  meta: ApiMeta;
}

// ─── Batch Sync ──────────────────────────────────────────────────────────────

export interface BatchOperation<T> {
  type: "create" | "update" | "delete";
  data: T;
}

export interface BatchResult {
  succeeded: string[];
  failed: Array<{
    clientId: string;
    error: string;
  }>;
}
