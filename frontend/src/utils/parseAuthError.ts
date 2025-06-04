import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function parseAuthError(err: unknown): {
  fieldErrors: Record<string, string>;
  errorMessage?: string;
} {
  const fieldErrors: Record<string, string> = {};
  let errorMessage: string | undefined;

  const fe = err as FetchBaseQueryError;
  if ('data' in fe && typeof fe.data === 'object' && fe.data !== null) {
    const data = fe.data as {
      message?: string;
      errors?: Array<{ field: string; message: string }>;
    };

    if (Array.isArray(data.errors) && data.errors.length) {
      data.errors.forEach((e) => {
        fieldErrors[e.field] = e.message;
      });
    }

    if (data.message && !Object.keys(fieldErrors).length) {
      // глобальная ошибка
      errorMessage = data.message;
    }
  } else {
    errorMessage = 'Неизвестная ошибка сети';
  }

  return { fieldErrors, errorMessage };
}
