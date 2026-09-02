import type { EmploymentPeriod } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Fecha inválida: ${value}`);
  }

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function differenceInDays(start: Date, end: Date): number {
  const utcStart = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );

  const utcEnd = Date.UTC(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
  );

  return Math.floor((utcEnd - utcStart) / MS_PER_DAY);
}

export function inclusiveDaysBetween(
  start: Date,
  end: Date,
): number {
  return Math.max(0, differenceInDays(start, end) + 1);
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function getCompletedYears(
  start: Date,
  end: Date,
): number {
  let years = end.getFullYear() - start.getFullYear();

  const anniversary = new Date(
    end.getFullYear(),
    start.getMonth(),
    start.getDate(),
    12,
  );

  if (end < anniversary) {
    years -= 1;
  }

  return Math.max(0, years);
}

export function getLastAnniversary(
  start: Date,
  end: Date,
): Date {
  const completedYears = getCompletedYears(start, end);

  return new Date(
    start.getFullYear() + completedYears,
    start.getMonth(),
    start.getDate(),
    12,
  );
}

export function getNextAnniversary(
  start: Date,
  end: Date,
): Date {
  const lastAnniversary = getLastAnniversary(start, end);

  return new Date(
    lastAnniversary.getFullYear() + 1,
    lastAnniversary.getMonth(),
    lastAnniversary.getDate(),
    12,
  );
}

export function calculateEmploymentPeriod(
  start: Date,
  end: Date,
): EmploymentPeriod {
  if (end < start) {
    throw new Error(
      "La fecha de salida no puede ser anterior a la fecha de ingreso.",
    );
  }

  const totalDays = inclusiveDaysBetween(start, end);

  /*
   * 365.2425 evita tratar todos los años como exactamente 365 días
   * al obtener una antigüedad decimal.
   */
  const exactYears = totalDays / 365.2425;

  const completedYears = getCompletedYears(start, end);

  const currentServiceYearStart = getLastAnniversary(start, end);

  const nextAnniversary = getNextAnniversary(start, end);

  const daysInCurrentServiceYear = inclusiveDaysBetween(
    currentServiceYearStart,
    end,
  );

  const currentServiceYearLength = Math.max(
    1,
    differenceInDays(
      currentServiceYearStart,
      nextAnniversary,
    ),
  );

  return {
    exactYears,
    completedYears,
    totalDays,
    currentServiceYearStart,
    daysInCurrentServiceYear,
    currentServiceYearLength,
  };
}

export function getCalendarYearWorkPeriod(
  employmentStart: Date,
  employmentEnd: Date,
) {
  const calendarYearStart = new Date(
    employmentEnd.getFullYear(),
    0,
    1,
    12,
  );

  const effectiveStart =
    employmentStart > calendarYearStart
      ? employmentStart
      : calendarYearStart;

  const daysWorked = inclusiveDaysBetween(
    effectiveStart,
    employmentEnd,
  );

  return {
    effectiveStart,
    daysWorked,
    daysInYear: getDaysInYear(employmentEnd.getFullYear()),
  };
}