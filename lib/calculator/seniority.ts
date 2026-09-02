import {
  MINIMUM_WAGE_2026,
  SENIORITY_PREMIUM_DAYS_PER_YEAR,
  SENIORITY_PREMIUM_SALARY_CAP_MULTIPLIER,
  VOLUNTARY_RESIGNATION_SENIORITY_YEARS,
} from "./constants";

import type {
  SalaryZone,
  SeniorityCalculation,
  Situation,
} from "./types";

interface SeniorityInput {
  situation: Situation;

  years: number;

  dailySalary: number;

  zone: SalaryZone;
}

export function shouldApplySeniorityPremium(
  situation: Situation,
  years: number,
): {
  applies: boolean;
  reason: string;
} {
  if (situation === "despido") {
    return {
      applies: true,
      reason:
        "La prima de antigüedad se contempla en separación por despido.",
    };
  }

  if (situation === "rescission-worker") {
    return {
      applies: true,
      reason:
        "Se contempla cuando la persona trabajadora se separa por una causa imputable al patrón.",
    };
  }

  if (
    situation === "renuncia" &&
    years >= VOLUNTARY_RESIGNATION_SENIORITY_YEARS
  ) {
    return {
      applies: true,
      reason:
        "La renuncia voluntaria alcanza al menos 15 años de antigüedad.",
    };
  }

  if (situation === "renuncia") {
    return {
      applies: false,
      reason:
        "En renuncia voluntaria se requieren al menos 15 años para este concepto.",
    };
  }

  return {
    applies: false,
    reason:
      "Este concepto no se agrega automáticamente para esta forma de terminación.",
  };
}

export function calculateSeniorityPremium({
  situation,
  years,
  dailySalary,
  zone,
}: SeniorityInput): SeniorityCalculation {
  const applicability =
    shouldApplySeniorityPremium(situation, years);

  const minimumWage = MINIMUM_WAGE_2026[zone];

  const salaryCap =
    minimumWage *
    SENIORITY_PREMIUM_SALARY_CAP_MULTIPLIER;

  const applicableDailySalary = Math.min(
    dailySalary,
    salaryCap,
  );

  const amount = applicability.applies
    ? applicableDailySalary *
      SENIORITY_PREMIUM_DAYS_PER_YEAR *
      years
    : 0;

  return {
    applies: applicability.applies,
    reason: applicability.reason,

    years,

    uncappedDailySalary: dailySalary,
    salaryCap,
    applicableDailySalary,

    daysPerYear: SENIORITY_PREMIUM_DAYS_PER_YEAR,

    amount,
  };
}