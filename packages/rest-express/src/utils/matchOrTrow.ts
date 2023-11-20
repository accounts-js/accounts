import { matchedData, validationResult } from 'express-validator';

export function matchOrThrow<T extends Record<string, any> = Record<string, any>>(
  ...args: Parameters<typeof matchedData>
): T {
  if (!validationResult(args[0]).isEmpty()) {
    throw new Error('Validation error');
  }
  return matchedData(...args) as T;
}
