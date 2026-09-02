import type {
  EmploymentPeriod,
  VacationCalculation,
} from "./types";

interface VacationInput {
  dailySalary: number;

  employment: EmploymentPeriod;

  vacationPremiumRate: number;

  previousPendingVacationDays: number;
  currentVacationDaysAlreadyUsed: number;
}

export function getLegalVacationDays(
  serviceYear: number,
): number {
  /*
   * LFT art. 76:
   *
   * Año 1: 12
   * Año 2: 14
   * Año 3: 16
   * Año 4: 18
   * Año 5: 20
   *
   * Después:
   * 6-10  = 22
   * 11-15 = 24
   * 16-20 = 26
   * etc.
   */

  if (serviceYear <= 1) return 12;
  if (serviceYear === 2) return 14;
  if (serviceYear === 3) return 16;
  if (serviceYear === 4) return 18;
  if (serviceYear === 5) return 20;

  return 22 + Math.floor((serviceYear - 6) / 5) * 2;
}

export function calculateVacations({
  dailySalary,
  employment,
  vacationPremiumRate,
  previousPendingVacationDays,
  currentVacationDaysAlreadyUsed,
}: VacationInput): VacationCalculation {
  /*
   * Si ya terminó un año completo, estamos generando
   * vacaciones correspondientes al siguiente año de servicio.
   *
   * Ejemplo:
   * completó 3 años -> está transitando su 4º año.
   */
  const currentServiceYear = employment.completedYears + 1;

  const annualEntitlementDays =
    getLegalVacationDays(currentServiceYear);

  const proportion =
    employment.daysInCurrentServiceYear /
    employment.currentServiceYearLength;

  const currentPeriodGeneratedDays = Math.min(
    annualEntitlementDays,
    annualEntitlementDays * proportion,
  );

  const currentPeriodUsedDays = Math.max(
    0,
    currentVacationDaysAlreadyUsed,
  );

  const currentPeriodPendingDays = Math.max(
    0,
    currentPeriodGeneratedDays - currentPeriodUsedDays,
  );

  const previousPendingDays = Math.max(
    0,
    previousPendingVacationDays,
  );

  const totalPendingDays =
    currentPeriodPendingDays + previousPendingDays;

  const vacationPay =
    dailySalary * totalPendingDays;

  const vacationPremium =
    vacationPay * vacationPremiumRate;

  return {
    annualEntitlementDays,

    currentPeriodGeneratedDays,
    currentPeriodUsedDays,
    currentPeriodPendingDays,

    previousPendingDays,
    totalPendingDays,

    vacationPay,
    vacationPremium,

    total: vacationPay + vacationPremium,
  };
}