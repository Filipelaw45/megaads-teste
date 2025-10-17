export function getBrasiliaTime(): Date {
  const now = new Date();
  const utcTime = now.getTime();
  const offset = -3 * 60 * 60 * 1000;
  return new Date(utcTime + offset);
}
