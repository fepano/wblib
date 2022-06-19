import { isString } from '../src'


describe('is.ts', () => {
  test('isString', () => {
    expect(isString('')).toBe(true)
  });
});
