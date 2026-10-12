/**
 * Typed errors returned by services. The UI maps `code` to an i18n key
 * "errors.<code>" in the "common" namespace.
 */
export type ServiceErrorCode =
  | 'network'
  | 'not_found'
  | 'forbidden'
  | 'validation'
  | 'level_too_low'
  | 'permit_required'
  | 'job_cap'
  | 'already_offered'
  | 'own_task'
  | 'task_closed'
  | 'agreement_required'
  | 'invalid_state'
  | 'milestones_mismatch'
  | 'insufficient_funds'
  | 'method_unavailable'
  | 'kyc_failed'
  | 'disputed'
  | 'budget_exceeded';

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;
  readonly params?: Record<string, string | number>;
  constructor(code: ServiceErrorCode, message?: string, params?: Record<string, string | number>) {
    super(message ?? code);
    this.name = 'ServiceError';
    this.code = code;
    this.params = params;
  }
}

export function isServiceError(e: unknown): e is ServiceError {
  return e instanceof ServiceError;
}
