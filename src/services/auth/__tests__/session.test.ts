import { readAccessToken } from '../session';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature';

describe('readAccessToken', () => {
  it('reads the token of a stored session', () => {
    expect(readAccessToken(JSON.stringify({ accessToken: TOKEN }))).toBe(TOKEN);
    expect(
      readAccessToken(
        JSON.stringify({ user: { _id: '1' }, accessToken: TOKEN }),
      ),
    ).toBe(TOKEN);
  });

  it('returns null for anything that is not a usable session', () => {
    expect(readAccessToken(null)).toBeNull();
    expect(readAccessToken('')).toBeNull();
    expect(readAccessToken('not json')).toBeNull();
    expect(readAccessToken('null')).toBeNull();
    expect(readAccessToken(JSON.stringify({}))).toBeNull();
    expect(readAccessToken(JSON.stringify({ accessToken: '' }))).toBeNull();
    expect(readAccessToken(JSON.stringify({ accessToken: 42 }))).toBeNull();
  });
});
