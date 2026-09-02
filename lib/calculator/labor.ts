import {
  DAYS_PER_MONTH_FOR_DAILY_SALARY,
  LEGAL_AGUINALDO_DAYS,
  LEGAL_VACATION_PREMIUM_RATE,
} from "./constants";

import {
  calculateEmploymentPeriod,
  getCalendarYearWorkPeriod,
  parseLocalDate,
} from "./dates";

import { calculateIndemnification } from "./indemnification";

import { calculateSeniorityPremium } from "./seniority";

import { calculateVacations } from "./vacations";

import type {
  AguinaldoCalculation,
  CalculatorFormData,
  LaborCalculationResult,
} from "./types";

export function calculateBaseDailySalary(
  data: CalculatorFormData,
): number {
  if (
    data.salaryType === "variable" &&
    data.variableDailySalary &&
    data.variableDailySalary > 0
  ) {
    return data.variableDailySalary;
  }

  return (
    data.monthlySalary /
    DAYS_PER_MONTH_FOR_DAILY_SALARY
  );
}

export function calculateIntegratedDailySalary(
  dailySalary: number,
  aguinaldoDaysPerYear: number,
  annualVacationDays: number,
  vacationPremiumRate: number,
  additionalIntegratedDailyAmount = 0,
): number {
  /*
   * Factor proporcional básico para prestaciones anuales.
   *
   * Posteriormente podemos ampliar el motor para componentes
   * contractuales más complejos que integren salario.
   */

  const aguinaldoFactor =
    aguinaldoDaysPerYear / 365;

  const vacationPremiumFactor =
    (annualVacationDays *
      vacationPremiumRate) /
    365;

  const baseIntegrated =
    dailySalary *
    (1 +
      aguinaldoFactor +
      vacationPremiumFactor);

  return (
    baseIntegrated +
    Math.max(0, additionalIntegratedDailyAmount)
  );
}

export function calculateAguinaldo(
  data: CalculatorFormData,
  dailySalary: number,
): AguinaldoCalculation {
  const start = parseLocalDate(data.startDate);
  const end = parseLocalDate(data.endDate);

  const period = getCalendarYearWorkPeriod(
    start,
    end,
  );

  const aguinaldoDays = Math.max(
    LEGAL_AGUINALDO_DAYS,
    data.aguinaldoDaysPerYear,
  );

  const generatedDays =
    aguinaldoDays *
    (period.daysWorked / period.daysInYear);

  const generatedAmount =
    dailySalary * generatedDays;

  const alreadyPaid = Math.max(
    0,
    data.aguinaldoAlreadyPaid,
  );

  const pendingAmount = Math.max(
    0,
    generatedAmount - alreadyPaid,
  );

  return {
    daysWorkedInCalendarYear:
      period.daysWorked,

    daysInCalendarYear:
      period.daysInYear,

    generatedDays,
    generatedAmount,

    alreadyPaid,
    pendingAmount,
  };
}

export function calculateLaborSettlement(
  data: CalculatorFormData,
): LaborCalculationResult {
  const warnings: string[] = [];

  const start = parseLocalDate(data.startDate);
  const end = parseLocalDate(data.endDate);

  if (end < start) {
    throw new Error(
      "La fecha de salida no puede ser anterior a la fecha de ingreso.",
    );
  }

  if (data.monthlySalary <= 0) {
    throw new Error(
      "El sueldo mensual debe ser mayor a cero.",
    );
  }

  const employment =
    calculateEmploymentPeriod(start, end);

  const dailySalary =
    calculateBaseDailySalary(data);

  const aguinaldo =
    calculateAguinaldo(data, dailySalary);

  const vacationPremiumRate = Math.max(
    LEGAL_VACATION_PREMIUM_RATE,
    data.vacationPremiumRate,
  );

  const vacations = calculateVacations({
    dailySalary,

    employment,

    vacationPremiumRate,

    previousPendingVacationDays:
      data.previousPendingVacationDays,

    currentVacationDaysAlreadyUsed:
      data.currentVacationDaysAlreadyUsed,
  });

  const integratedDailySalary =
    calculateIntegratedDailySalary(
      dailySalary,

      Math.max(
        LEGAL_AGUINALDO_DAYS,
        data.aguinaldoDaysPerYear,
      ),

      vacations.annualEntitlementDays,

      vacationPremiumRate,

      data.additionalIntegratedDailyAmount ?? 0,
    );

  const unpaidSalary =
    dailySalary *
    Math.max(0, data.unpaidSalaryDays);

  const seniority =
    calculateSeniorityPremium({
      situation: data.situation,

      years: employment.exactYears,

      dailySalary,

      zone: data.salaryZone,
    });

  const indemnification =
    calculateIndemnification({
      integratedDailySalary,

      exactYears: employment.exactYears,

      contractType: data.contractType,
    });

  const pendingPTU = Math.max(
    0,
    data.knownPendingPTU ?? 0,
  );

  const otherPendingBenefits = Math.max(
    0,
    data.otherPendingBenefits ?? 0,
  );

  const earnedRightsTotal =
    unpaidSalary +
    aguinaldo.pendingAmount +
    vacations.total +
    seniority.amount +
    pendingPTU +
    otherPendingBenefits;

  /*
   * Escenario base de despido:
   *
   * derechos generados +
   * referencia constitucional de 3 meses.
   *
   * NO agregamos automáticamente art. 50.
   */
  const dismissalThreeMonthScenario =
    earnedRightsTotal +
    indemnification.threeMonths;

  /*
   * Escenario separado para casos donde el artículo 50
   * efectivamente pudiera resultar aplicable.
   */
  const article50ReferenceScenario =
    dismissalThreeMonthScenario +
    indemnification.article50Amount;

  if (data.salaryType === "variable") {
    warnings.push(
      "El resultado depende de que el salario diario variable capturado represente correctamente el promedio aplicable.",
    );
  }

  if (
    data.situation === "despido" &&
    data.employerClaimsCause === "yes"
  ) {
    warnings.push(
      "La empresa afirma que existe una causa de despido. Cuenta Clara no determina si esa causa es jurídicamente válida.",
    );
  }

  if (data.situation === "no-se") {
    warnings.push(
      "No se seleccionó una forma concreta de terminación. Los derechos generados pueden estimarse, pero una indemnización depende del supuesto jurídico.",
    );
  }

  if (
    data.contractType === "fixed-less-year" ||
    data.contractType === "fixed-more-year"
  ) {
    warnings.push(
      "Los contratos por tiempo determinado requieren revisar que la temporalidad haya sido jurídicamente válida y cuál fue la causa real de terminación.",
    );
  }

  warnings.push(
    "Los resultados son montos brutos antes de impuestos.",
  );

  return {
    dailySalary,
    integratedDailySalary,

    employment,

    unpaidSalary,

    aguinaldo,
    vacations,
    seniority,

    pendingPTU,
    otherPendingBenefits,

    earnedRightsTotal,

    indemnification,

    referenceTotals: {
      finiquito: earnedRightsTotal,

      dismissalThreeMonthScenario,

      article50ReferenceScenario,
    },

    warnings,
  };
}