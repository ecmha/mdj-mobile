// mdj://reset-password?token=… — opened from the landing page linked in the
// password reset email. Parsed by hand: React Native's URL polyfill doesn't
// implement searchParams.
const RESET_LINK =
  /^mdj:\/\/reset-password\/?\?(?:[^#]*&)?token=([A-Za-z0-9_-]+)(?:[&#]|$)/;

export const parseResetToken = (url: string | null | undefined) =>
  url?.match(RESET_LINK)?.[1] ?? null;
