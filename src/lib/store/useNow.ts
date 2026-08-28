import { useEffect, useState } from "react";

/** Current time in minutes since epoch, refreshed periodically for live timers/feasibility checks. */
export function useNowEpochMinutes(intervalMs = 15000): number {
  const [now, setNow] = useState(() => Math.round(Date.now() / 60000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.round(Date.now() / 60000)), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
