import { useEffect, useState } from 'react';

/**
 * Opening hours — edit this to change the schedule.
 * `days` uses JS day indexes: 0 = Sunday, 1 = Monday ... 6 = Saturday.
 * `open` and `close` are minutes from midnight (e.g. 10:00 = 600, 22:00 = 1320).
 * Overnight hours (close < open, e.g. 22:00 → 02:00) are supported.
 */
export type ScheduleBlock = {
  days: number[];
  openMinutes: number;
  closeMinutes: number;
};

export const SAMI_SCHEDULE: ScheduleBlock[] = [
  { days: [1, 2, 3, 4, 5], openMinutes: 10 * 60, closeMinutes: 22 * 60 },
  { days: [0, 6], openMinutes: 11 * 60, closeMinutes: 23 * 60 },
];

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const TZ = 'Asia/Tbilisi';

function getTbilisiNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const weekdayStr = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hourStr = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minuteStr = parts.find((p) => p.type === 'minute')?.value ?? '00';

  return {
    day: WEEKDAY_INDEX[weekdayStr] ?? 1,
    minutes: (parseInt(hourStr, 10) % 24) * 60 + parseInt(minuteStr, 10),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function formatTime(minutes: number) {
  const total = ((minutes % 1440) + 1440) % 1440;
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export type OpenStatus = {
  isOpen: boolean;
  todayOpen: number | null;
  todayClose: number | null;
  /** Minutes until close (if open) or until next open (if closed). */
  minutesUntilChange: number | null;
  /** The formatted next change time, e.g. "22:00". */
  nextChangeAt: string | null;
};

function computeStatus(): OpenStatus {
  const { day, minutes } = getTbilisiNow();

  // Find today's block
  const todayBlock = SAMI_SCHEDULE.find((b) => b.days.includes(day));

  if (todayBlock) {
    const { openMinutes, closeMinutes } = todayBlock;
    // Handle overnight (close wraps past midnight)
    const isOvernight = closeMinutes <= openMinutes;
    const withinNormal = !isOvernight && minutes >= openMinutes && minutes < closeMinutes;
    const withinOvernight = isOvernight && (minutes >= openMinutes || minutes < closeMinutes);

    if (withinNormal || withinOvernight) {
      const till =
        withinOvernight && minutes < closeMinutes ? closeMinutes - minutes : closeMinutes - minutes;
      return {
        isOpen: true,
        todayOpen: openMinutes,
        todayClose: closeMinutes,
        minutesUntilChange: till,
        nextChangeAt: formatTime(closeMinutes),
      };
    }

    // Same day but before opening
    if (!isOvernight && minutes < openMinutes) {
      return {
        isOpen: false,
        todayOpen: openMinutes,
        todayClose: closeMinutes,
        minutesUntilChange: openMinutes - minutes,
        nextChangeAt: formatTime(openMinutes),
      };
    }
  }

  // Closed — find next opening day
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (day + offset) % 7;
    const block = SAMI_SCHEDULE.find((b) => b.days.includes(nextDay));
    if (block) {
      return {
        isOpen: false,
        todayOpen: todayBlock?.openMinutes ?? null,
        todayClose: todayBlock?.closeMinutes ?? null,
        minutesUntilChange: offset * 1440 - minutes + block.openMinutes,
        nextChangeAt: formatTime(block.openMinutes),
      };
    }
  }

  return {
    isOpen: false,
    todayOpen: null,
    todayClose: null,
    minutesUntilChange: null,
    nextChangeAt: null,
  };
}

/** Same on server and first client paint — avoids hydration mismatch vs live `computeStatus()`. */
const HYDRATION_PLACEHOLDER: OpenStatus = {
  isOpen: false,
  todayOpen: null,
  todayClose: null,
  minutesUntilChange: null,
  nextChangeAt: null,
};

/**
 * Live open/closed from Tbilisi time. Initial render uses a fixed placeholder so SSR and the
 * browser match; real schedule updates after mount (and every 30s).
 */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>(HYDRATION_PLACEHOLDER);

  useEffect(() => {
    const tick = () => setStatus(computeStatus());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}
