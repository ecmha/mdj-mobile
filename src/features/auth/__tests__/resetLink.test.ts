import { parseResetToken } from '../resetLink';

const TOKEN = 'aB3_x-9ZqWertyuiopASDFGHJKLzxcvbnm0123456';

describe('parseResetToken', () => {
  it('reads the token of a reset link', () => {
    expect(parseResetToken(`mdj://reset-password?token=${TOKEN}`)).toBe(TOKEN);
    expect(parseResetToken(`mdj://reset-password/?token=${TOKEN}`)).toBe(TOKEN);
    expect(parseResetToken(`mdj://reset-password?a=1&token=${TOKEN}&b=2`)).toBe(
      TOKEN,
    );
  });

  it('ignores anything that is not a well-formed reset link', () => {
    expect(parseResetToken(null)).toBeNull();
    expect(parseResetToken('mdj://reset-password')).toBeNull();
    expect(parseResetToken('mdj://reset-password?token=')).toBeNull();
    expect(parseResetToken(`mdj://other?token=${TOKEN}`)).toBeNull();
    expect(parseResetToken(`https://evil.example/?token=${TOKEN}`)).toBeNull();
    expect(parseResetToken('mdj://reset-password?token=abc%20def')).toBeNull();
  });
});
