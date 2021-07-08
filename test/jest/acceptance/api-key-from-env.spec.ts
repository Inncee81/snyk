const key = (process.env.SNYK_TOKEN = '123456');
import * as snyk from '../../../src/lib';

test('api token from env', () => {
  expect(key).toEqual(snyk.api);
});
