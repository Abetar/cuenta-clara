import {
  ARTICLE_50_DAYS_PER_YEAR,
  CONSTITUTIONAL_INDEMNITY_DAYS,
} from "./constants";

import type {
  ContractType,
  IndemnificationCalculation,
} from "./types";

interface IndemnificationInput {
  integratedDailySalary: number;
  exactYears: number;
  contractType: ContractType;
}

export function calculateThreeMonthIndemnity(
  integratedDailySalary: number,
): number {
  return (
    integratedDailySalary *
    CONSTITUTIONAL_INDEMNITY_DAYS
  );
}

export function calculateTwentyDaysPerYear(
  integratedDailySalary: number,
  exactYears: number,
): number {
  return (
    integratedDailySalary *
    ARTICLE_50_DAYS_PER_YEAR *
    exactYears
  );
}

export function calculateArticle50Amount({
  integratedDailySalary,
  exactYears,
  contractType,
}: IndemnificationInput): number {
  /*
   * Este cálculo es una REFERENCIA del artículo 50.
   *
   * No significa que proceda automáticamente.
   */

  if (contractType === "indefinite") {
    return calculateTwentyDaysPerYear(
      integratedDailySalary,
      exactYears,
    );
  }

  /*
   * Contrato determinado menor a un año:
   * referencia equivalente a la mitad del tiempo
   * de servicios prestados.
   */
  if (contractType === "fixed-less-year") {
    const approximateWorkedDays =
      exactYears * 365.2425;

    return (
      integratedDailySalary *
      (approximateWorkedDays / 2)
    );
  }

  /*
   * Contrato determinado mayor a un año:
   *
   * 6 meses por el primer año +
   * 20 días por cada año posterior.
   */
  if (contractType === "fixed-more-year") {
    const firstYearAmount =
      integratedDailySalary * 180;

    const additionalYears = Math.max(
      0,
      exactYears - 1,
    );

    const additionalAmount =
      integratedDailySalary *
      ARTICLE_50_DAYS_PER_YEAR *
      additionalYears;

    return firstYearAmount + additionalAmount;
  }

  return 0;
}

export function calculateIndemnification(
  input: IndemnificationInput,
): IndemnificationCalculation {
  const threeMonths =
    calculateThreeMonthIndemnity(
      input.integratedDailySalary,
    );

  const twentyDaysPerYear =
    calculateTwentyDaysPerYear(
      input.integratedDailySalary,
      input.exactYears,
    );

  const article50Amount =
    calculateArticle50Amount(input);

  return {
    integratedDailySalary:
      input.integratedDailySalary,

    threeMonths,
    twentyDaysPerYear,

    article50Amount,

    /*
     * Esto es intencional.
     *
     * Cuenta Clara NO va a presentar 20 días/año como
     * componente automático de todo despido.
     */
    twentyDaysAutomaticallyIncluded: false,
  };
}