import { HttpErrorResponse } from '@angular/common/http';

export function isHttpNetworkError(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) return false;
  if (error.status === 0) return true;
  const body = error.error;
  if (typeof ProgressEvent !== 'undefined' && body instanceof ProgressEvent) return true;
  if (body && typeof body === 'object' && 'isTrusted' in body && !('message' in body)) return true;
  return false;
}

export function isNetworkErrorPayload(payload: unknown): boolean {
  if (payload == null) return false;
  if (typeof ProgressEvent !== 'undefined' && payload instanceof ProgressEvent) return true;
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'isTrusted' in payload &&
    !('message' in payload)
  ) {
    return true;
  }
  return false;
}
