import { expect } from '@jest/globals';

import { addCustomLogToReporter } from './helper';

export enum JestType {
  equals = 'EQUALS',
  null = 'NULL',
}
export async function jestExpect(
  message: string,
  expected: boolean | unknown,
  received: boolean | unknown,
  exceptionType: string = JestType.equals,
) {
  await addCustomLogToReporter(message);
  switch (exceptionType) {
    case JestType.equals:
      expect(expected).toEqual(received);
      break;
    case JestType.null:
      expect(received).toBeNull();
      break;
    default:
      expect(expected).toEqual(received);
      break;
  }
}
