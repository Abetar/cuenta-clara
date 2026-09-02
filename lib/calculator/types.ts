export type Situation =
  | ""
  | "renuncia"
  | "despido"
  | "oferta"
  | "rescission-worker"
  | "contract-end"
  | "no-se";

export type SalaryType = "" | "fixed" | "variable";

export type ContractType =
  | ""
  | "indefinite"
  | "fixed-less-year"
  | "fixed-more-year";

export type YesNo = "" | "yes" | "no";

export type YesNoUnsure = "" | "yes" | "no" | "unsure";

export type SalaryZone = "general" | "border";

export interface CalculatorFormData {
  monthlySalary: number;
  salaryType: SalaryType;

  /**
   * Para salario variable:
   * promedio diario de los 30 días efectivamente trabajados
   * anteriores a la terminación.
   */
  variableDailySalary?: number;

  startDate: string;
  endDate: string;

  contractType: ContractType;
  situation: Situation;

  salaryZone: SalaryZone;

  unpaidSalaryDays: number;

  aguinaldoDaysPerYear: number;
  aguinaldoAlreadyPaid: number;

  vacationPremiumRate: number;

  /**
   * Días pendientes de periodos vacacionales anteriores.
   */
  previousPendingVacationDays: number;

  /**
   * Días del periodo vacacional actual que ya fueron
   * disfrutados o pagados.
   */
  currentVacationDaysAlreadyUsed: number;

  employerOffer?: number;
  employerOfferIncludesFiniquito?: YesNoUnsure;

  employerClaimsCause?: YesNoUnsure;

  knownPendingPTU?: number;

  /**
   * Prestaciones ya devengadas y conocidas por el usuario.
   * No forman automáticamente parte del SDI.
   */
  otherPendingBenefits?: number;

  /**
   * Monto diario adicional que sí integra salario para
   * indemnización, cuando el usuario lo conoce.
   *
   * Ejemplos pueden incluir ciertas comisiones,
   * gratificaciones u otras prestaciones integrantes.
   */
  additionalIntegratedDailyAmount?: number;
}

export interface EmploymentPeriod {
  exactYears: number;
  completedYears: number;
  totalDays: number;
  currentServiceYearStart: Date;
  daysInCurrentServiceYear: number;
  currentServiceYearLength: number;
}

export interface VacationCalculation {
  annualEntitlementDays: number;

  currentPeriodGeneratedDays: number;
  currentPeriodUsedDays: number;
  currentPeriodPendingDays: number;

  previousPendingDays: number;
  totalPendingDays: number;

  vacationPay: number;
  vacationPremium: number;
  total: number;
}

export interface AguinaldoCalculation {
  daysWorkedInCalendarYear: number;
  daysInCalendarYear: number;

  generatedDays: number;
  generatedAmount: number;

  alreadyPaid: number;
  pendingAmount: number;
}

export interface SeniorityCalculation {
  applies: boolean;
  reason: string;

  years: number;

  uncappedDailySalary: number;
  salaryCap: number;
  applicableDailySalary: number;

  daysPerYear: number;
  amount: number;
}

export interface IndemnificationCalculation {
  integratedDailySalary: number;

  threeMonths: number;
  twentyDaysPerYear: number;

  article50Amount: number;

  twentyDaysAutomaticallyIncluded: boolean;
}

export interface LaborCalculationResult {
  dailySalary: number;
  integratedDailySalary: number;

  employment: EmploymentPeriod;

  unpaidSalary: number;

  aguinaldo: AguinaldoCalculation;
  vacations: VacationCalculation;
  seniority: SeniorityCalculation;

  pendingPTU: number;
  otherPendingBenefits: number;

  earnedRightsTotal: number;

  indemnification: IndemnificationCalculation;

  referenceTotals: {
    finiquito: number;
    dismissalThreeMonthScenario: number;
    article50ReferenceScenario: number;
  };

  warnings: string[];
}

export interface TaxEstimate {
  supported: boolean;
  grossAmount: number;
  estimatedTax: number | null;
  estimatedNet: number | null;
  message: string;
}