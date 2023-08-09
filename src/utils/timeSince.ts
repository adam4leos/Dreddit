export function timeSince(date: Date): string {
  const now = Date.now();
  const seconds = Math.floor((now - date.getTime()) / 1000);

  if (seconds / 31536000 > 1) {
    return Math.floor(seconds / 31536000) + " yr.";
  }

  if (seconds / 2592000 > 1) {
    return Math.floor(seconds / 2592000) + " mo.";
  }

  if (seconds / 86400 > 1) {
    return Math.floor(seconds / 86400) + " days";
  }

  if (seconds / 3600 > 1) {
    return Math.floor(seconds / 3600) + " hr.";
  }

  if (seconds / 60 > 1) {
    return Math.floor(seconds / 60) + " min.";
  }

  return Math.floor(seconds) + " sec.";
}