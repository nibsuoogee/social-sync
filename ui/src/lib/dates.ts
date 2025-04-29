/**
 * Extract the hours and minutes of an ISO date string to the
 * form "hh:mm", e.g., "17:38"
 */
export function isoDateToHoursMinutes(iso_time: Date) {
  const dateTime = new Date(iso_time);
  return dateTime.toTimeString().slice(0, 5);
}

/**
 * Compare the year, month, and day-of-the-month of two dates
 */
export const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Takes either an ISO string or a date object and returns a date object.
 */
export function ensureDate(date: string | Date): Date {
  if (typeof date === "string") {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date() : parsed; // fallback if invalid
  }

  return date;
}
