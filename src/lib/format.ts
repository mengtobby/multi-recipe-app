const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

/** Converts a `<input type="datetime-local">` value to minutes since epoch. */
export function toEpochMinutes(dateTimeLocal: string): number | null {
  if (!dateTimeLocal) return null;
  const ms = new Date(dateTimeLocal).getTime();
  return Number.isNaN(ms) ? null : Math.round(ms / 60000);
}

export function fromEpochMinutes(epochMinutes: number): Date {
  return new Date(epochMinutes * 60000);
}

export function formatClockTime(epochMinutes: number): string {
  return timeFormatter.format(fromEpochMinutes(epochMinutes));
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}
