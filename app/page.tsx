"use client";

import { useEffect, useMemo, useState } from "react";

import Calculator from "@/components/calculator/Calculator";
import CalculationLoader from "@/components/calculator/CalculationLoader";
import DateField from "@/components/calculator/DateField";
import Question from "@/components/calculator/Question";
import Results from "@/components/calculator/Results";
import SiteFooter from "@/components/SiteFooter";
import MexicoNumbersBubble from "@/components/MexicoNumbersBubble";

import { calculateLaborSettlement } from "@/lib/calculator/labor";

import type {
  CalculatorFormData,
  ContractType,
  LaborCalculationResult,
  SalaryType,
  SalaryZone,
  Situation,
  YesNoUnsure,
} from "@/lib/calculator/types";

type Step =
  | "salaryType"
  | "salary"
  | "variableSalary"
  | "startDate"
  | "endDate"
  | "contractType"
  | "situation"
  | "offer"
  | "offerIncludes"
  | "employerCause"
  | "unpaidSalary"
  | "aguinaldoDays"
  | "aguinaldoPaid"
  | "vacationPremium"
  | "previousVacations"
  | "currentVacationsUsed"
  | "ptu"
  | "otherBenefits"
  | "integratedBenefits"
  | "zone"
  | "summary"
  | "loading"
  | "result";

type QuestionStep = Exclude<
  Step,
  "summary" | "loading" | "result"
>;

interface SavedCalculatorState {
  formData: CalculatorFormData;
  currentStep: Step;
}

const STORAGE_KEY =
  "cuenta-clara-calculator-v1";

const initialFormData: CalculatorFormData = {
  monthlySalary: 0,
  salaryType: "",
  variableDailySalary: undefined,

  startDate: "",
  endDate: "",

  contractType: "",
  situation: "",

  salaryZone: "general",

  unpaidSalaryDays: 0,

  aguinaldoDaysPerYear: 15,
  aguinaldoAlreadyPaid: 0,

  vacationPremiumRate: 0.25,

  previousPendingVacationDays: 0,
  currentVacationDaysAlreadyUsed: 0,

  employerOffer: undefined,
  employerOfferIncludesFiniquito: "",

  employerClaimsCause: "",

  knownPendingPTU: 0,
  otherPendingBenefits: 0,

  additionalIntegratedDailyAmount: 0,
};

function formatNumberInput(value: string) {
  const clean = value.replace(/\D/g, "");

  if (!clean) return "";

  return Number(clean).toLocaleString("en-US");
}

function parseNumberInput(value: string) {
  return Number(value.replace(/,/g, "")) || 0;
}

function formatStoredNumber(value?: number) {
  if (!value || value <= 0) return "";

  return Math.round(value).toLocaleString("en-US");
}

function formatDateMX(value: string) {
  if (!value) return "—";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "—";
  }

  return `${day}/${month}/${year}`;
}

function money(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function hasAtLeastFifteenYears(
  startDate: string,
  endDate: string,
) {
  if (!startDate || !endDate) {
    return false;
  }

  const start = new Date(
    `${startDate}T12:00:00`,
  );

  const end = new Date(
    `${endDate}T12:00:00`,
  );

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return false;
  }

  let completedYears =
    end.getFullYear() -
    start.getFullYear();

  const anniversary = new Date(
    end.getFullYear(),
    start.getMonth(),
    start.getDate(),
    12,
  );

  if (end < anniversary) {
    completedYears -= 1;
  }

  return completedYears >= 15;
}

function getSituationLabel(
  situation: Situation,
) {
  switch (situation) {
    case "renuncia":
      return "Renuncia";

    case "despido":
      return "Despido";

    case "oferta":
      return "Oferta para salir";

    case "rescission-worker":
      return "Salida por incumplimiento de la empresa";

    case "contract-end":
      return "Terminación de contrato";

    case "no-se":
      return "Situación por definir";

    default:
      return "Sin especificar";
  }
}

function getContractLabel(
  contractType: ContractType,
) {
  switch (contractType) {
    case "indefinite":
      return "Tiempo indefinido";

    case "fixed-less-year":
      return "Determinado menor a un año";

    case "fixed-more-year":
      return "Determinado de un año o más";

    default:
      return "Sin especificar";
  }
}

export default function Home() {
  const [formData, setFormData] =
    useState<CalculatorFormData>(
      initialFormData,
    );

  const [
    currentStepIndex,
    setCurrentStepIndex,
  ] = useState(0);

  const [direction, setDirection] =
    useState<
      "forward" | "backward"
    >("forward");

  const [error, setError] = useState("");

  const [result, setResult] =
    useState<LaborCalculationResult | null>(
      null,
    );

  const [
    hasHydrated,
    setHasHydrated,
  ] = useState(false);

  const [
    restoredStep,
    setRestoredStep,
  ] = useState<Step | null>(null);

  const [salaryInput, setSalaryInput] =
    useState("");

  const [
    variableSalaryInput,
    setVariableSalaryInput,
  ] = useState("");

  const [offerInput, setOfferInput] =
    useState("");

  const [
    aguinaldoPaidInput,
    setAguinaldoPaidInput,
  ] = useState("");

  const [ptuInput, setPtuInput] =
    useState("");

  const [
    otherBenefitsInput,
    setOtherBenefitsInput,
  ] = useState("");

  const [
    integratedBenefitsInput,
    setIntegratedBenefitsInput,
  ] = useState("");

  const needsSalaryZone = useMemo(() => {
    if (
      formData.situation === "despido" ||
      formData.situation ===
        "rescission-worker"
    ) {
      return true;
    }

    if (
      formData.situation === "renuncia"
    ) {
      return hasAtLeastFifteenYears(
        formData.startDate,
        formData.endDate,
      );
    }

    return false;
  }, [
    formData.situation,
    formData.startDate,
    formData.endDate,
  ]);

  const steps = useMemo<Step[]>(() => {
    const list: Step[] = [
      "salaryType",
      "salary",
    ];

    if (
      formData.salaryType === "variable"
    ) {
      list.push("variableSalary");
    }

    list.push(
      "startDate",
      "endDate",
      "contractType",
      "situation",
    );

    if (
      formData.situation === "oferta"
    ) {
      list.push(
        "offer",
        "offerIncludes",
      );
    }

    if (
      formData.situation === "despido"
    ) {
      list.push("employerCause");
    }

    list.push(
      "unpaidSalary",
      "aguinaldoDays",
      "aguinaldoPaid",
      "vacationPremium",
      "previousVacations",
      "currentVacationsUsed",
      "ptu",
      "otherBenefits",
      "integratedBenefits",
    );

    if (needsSalaryZone) {
      list.push("zone");
    }

    list.push(
      "summary",
      "loading",
      "result",
    );

    return list;
  }, [
    formData.salaryType,
    formData.situation,
    needsSalaryZone,
  ]);

  const currentStep =
    steps[currentStepIndex] ??
    "salaryType";

  const questionSteps = steps.filter(
    (
      step,
    ): step is QuestionStep =>
      step !== "summary" &&
      step !== "loading" &&
      step !== "result",
  );

  const questionIndex =
    currentStep === "summary" ||
    currentStep === "loading" ||
    currentStep === "result"
      ? -1
      : questionSteps.indexOf(
          currentStep,
        );

  const progress =
    currentStep === "summary" ||
    currentStep === "loading" ||
    currentStep === "result"
      ? 100
      : ((questionIndex + 1) /
          questionSteps.length) *
        100;

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (!stored) {
        setHasHydrated(true);
        return;
      }

      const parsed =
        JSON.parse(
          stored,
        ) as SavedCalculatorState;

      if (
        !parsed ||
        !parsed.formData
      ) {
        setHasHydrated(true);
        return;
      }

      setFormData(
        parsed.formData,
      );

      setSalaryInput(
        formatStoredNumber(
          parsed.formData.monthlySalary,
        ),
      );

      setVariableSalaryInput(
        formatStoredNumber(
          parsed.formData
            .variableDailySalary,
        ),
      );

      setOfferInput(
        formatStoredNumber(
          parsed.formData.employerOffer,
        ),
      );

      setAguinaldoPaidInput(
        formatStoredNumber(
          parsed.formData
            .aguinaldoAlreadyPaid,
        ),
      );

      setPtuInput(
        formatStoredNumber(
          parsed.formData.knownPendingPTU,
        ),
      );

      setOtherBenefitsInput(
        formatStoredNumber(
          parsed.formData
            .otherPendingBenefits,
        ),
      );

      setIntegratedBenefitsInput(
        formatStoredNumber(
          parsed.formData
            .additionalIntegratedDailyAmount,
        ),
      );

      if (
        parsed.currentStep === "loading" ||
        parsed.currentStep === "result"
      ) {
        setRestoredStep("summary");
      } else {
        setRestoredStep(
          parsed.currentStep,
        );
      }
    } catch {
      window.localStorage.removeItem(
        STORAGE_KEY,
      );
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (
      !hasHydrated ||
      !restoredStep
    ) {
      return;
    }

    const restoredIndex =
      steps.indexOf(restoredStep);

    if (restoredIndex >= 0) {
      setCurrentStepIndex(
        restoredIndex,
      );
    }

    setRestoredStep(null);
  }, [
    hasHydrated,
    restoredStep,
    steps,
  ]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const safeStep: Step =
      currentStep === "loading" ||
      currentStep === "result"
        ? "summary"
        : currentStep;

    const payload: SavedCalculatorState =
      {
        formData,
        currentStep: safeStep,
      };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(payload),
    );
  }, [
    formData,
    currentStep,
    hasHydrated,
  ]);

  const updateForm = <
    K extends keyof CalculatorFormData,
  >(
    field: K,
    value: CalculatorFormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const advanceChoice = (
    callback: () => void,
  ) => {
    callback();

    setError("");
    setDirection("forward");

    window.setTimeout(() => {
      setCurrentStepIndex(
        (previous) =>
          Math.min(
            previous + 1,
            steps.length - 1,
          ),
      );
    }, 160);
  };

  const goBack = () => {
    if (
      currentStepIndex <= 0
    ) {
      return;
    }

    setError("");
    setDirection("backward");

    setCurrentStepIndex(
      (previous) =>
        Math.max(
          0,
          previous - 1,
        ),
    );
  };

  const validateCurrentStep = () => {
    setError("");

    switch (currentStep) {
      case "salaryType":
        if (
          !formData.salaryType
        ) {
          setError(
            "Selecciona cómo recibes tu sueldo.",
          );

          return false;
        }

        break;

      case "salary":
        if (
          formData.monthlySalary <= 0
        ) {
          setError(
            "Escribe tu sueldo mensual.",
          );

          return false;
        }

        break;

      case "variableSalary":
        if (
          !formData.variableDailySalary ||
          formData.variableDailySalary <= 0
        ) {
          setError(
            "Escribe tu promedio diario de los últimos 30 días trabajados.",
          );

          return false;
        }

        break;

      case "startDate":
        if (
          !formData.startDate
        ) {
          setError(
            "Escribe una fecha de ingreso válida.",
          );

          return false;
        }

        break;

      case "endDate":
        if (
          !formData.endDate
        ) {
          setError(
            "Escribe una fecha de salida válida.",
          );

          return false;
        }

        if (
          formData.startDate &&
          formData.endDate <
            formData.startDate
        ) {
          setError(
            "Tu último día no puede ser anterior a tu fecha de ingreso.",
          );

          return false;
        }

        if (
          new Date(
            `${formData.endDate}T12:00:00`,
          ).getFullYear() !== 2026
        ) {
          setError(
            "Por ahora esta versión calcula terminaciones correspondientes a 2026.",
          );

          return false;
        }

        break;

      case "contractType":
        if (
          !formData.contractType
        ) {
          setError(
            "Selecciona el tipo de contrato que tienes.",
          );

          return false;
        }

        break;

      case "situation":
        if (
          !formData.situation
        ) {
          setError(
            "Selecciona la opción que mejor describe tu situación.",
          );

          return false;
        }

        break;

      case "offer":
        if (
          !formData.employerOffer ||
          formData.employerOffer <= 0
        ) {
          setError(
            "Escribe cuánto te ofreció la empresa.",
          );

          return false;
        }

        break;

      case "offerIncludes":
        if (
          !formData
            .employerOfferIncludesFiniquito
        ) {
          setError(
            "Selecciona una opción.",
          );

          return false;
        }

        break;

      case "employerCause":
        if (
          !formData
            .employerClaimsCause
        ) {
          setError(
            "Selecciona una opción.",
          );

          return false;
        }

        break;

      case "aguinaldoDays":
        if (
          formData.aguinaldoDaysPerYear <
          15
        ) {
          setError(
            "El aguinaldo no puede ser menor a 15 días.",
          );

          return false;
        }

        break;

      case "vacationPremium":
        if (
          formData.vacationPremiumRate <
          0.25
        ) {
          setError(
            "La prima vacacional no puede ser menor a 25%.",
          );

          return false;
        }

        break;
    }

    return true;
  };

  const generateResult = () => {
    try {
      const calculation =
        calculateLaborSettlement(
          formData,
        );

      setResult(calculation);
      setError("");

      window.setTimeout(() => {
        setDirection("forward");

        const resultIndex =
          steps.indexOf("result");

        setCurrentStepIndex(
          resultIndex,
        );
      }, 1400);
    } catch (
      calculationError
    ) {
      setError(
        calculationError instanceof Error
          ? calculationError.message
          : "No pudimos generar el cálculo.",
      );

      setDirection("backward");

      const summaryIndex =
        steps.indexOf("summary");

      setCurrentStepIndex(
        Math.max(
          0,
          summaryIndex,
        ),
      );
    }
  };

  const goNext = () => {
    if (
      !validateCurrentStep()
    ) {
      return;
    }

    setError("");
    setDirection("forward");

    setCurrentStepIndex(
      (previous) =>
        Math.min(
          previous + 1,
          steps.length - 1,
        ),
    );
  };

  const calculateFromSummary =
    () => {
      setError("");
      setDirection("forward");

      const loadingIndex =
        steps.indexOf("loading");

      setCurrentStepIndex(
        loadingIndex,
      );

      window.setTimeout(() => {
        generateResult();
      }, 50);
    };

  const editAnswers = () => {
    setResult(null);
    setError("");
    setDirection("backward");
    setCurrentStepIndex(0);
  };

  const restart = () => {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );

    setFormData({
      ...initialFormData,
    });

    setSalaryInput("");
    setVariableSalaryInput("");
    setOfferInput("");
    setAguinaldoPaidInput("");
    setPtuInput("");
    setOtherBenefitsInput("");
    setIntegratedBenefitsInput("");

    setResult(null);
    setError("");

    setDirection("backward");
    setCurrentStepIndex(0);
  };

  const renderChoice = (
    selected: boolean,
    onSelect: () => void,
    title: string,
    description?: string,
  ) => {
    return (
      <button
        type="button"
        onClick={() =>
          advanceChoice(onSelect)
        }
        className={`w-full rounded-xl border p-4 text-left transition ${
          selected
            ? "border-[#163d4f] bg-[#f2f7f9]"
            : "border-[#dce3e8] bg-white hover:border-[#9eafb9]"
        }`}
      >
        <p className="font-medium text-[#17212b]">
          {title}
        </p>

        {description && (
          <p className="mt-1 text-sm leading-6 text-[#71808a]">
            {description}
          </p>
        )}
      </button>
    );
  };

  const renderNumberField = ({
    value,
    onChange,
    prefix,
    suffix,
    placeholder,
  }: {
    value: string;
    onChange: (
      value: string,
    ) => void;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
  }) => {
    return (
      <div className="mt-7 flex items-center rounded-xl border border-[#ccd5dc] px-4 focus-within:border-[#2b6f86]">
        {prefix && (
          <span className="mr-2 text-[#7a858e]">
            {prefix}
          </span>
        )}

        <input
          autoFocus
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event) =>
            onChange(
              formatNumberInput(
                event.target.value,
              ),
            )
          }
          placeholder={placeholder}
          className="w-full bg-transparent py-4 text-2xl font-semibold outline-none placeholder:text-[#c1c8cd]"
        />

        {suffix && (
          <span className="ml-3 text-sm text-[#8a949c]">
            {suffix}
          </span>
        )}
      </div>
    );
  };

  const questionContent = () => {
    switch (currentStep) {
      case "salaryType":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cómo recibes normalmente tu
              sueldo?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Esto nos ayuda a elegir la base
              correcta para el cálculo.
            </p>

            <div className="mt-7 space-y-3">
              {renderChoice(
                formData.salaryType ===
                  "fixed",
                () =>
                  updateForm(
                    "salaryType",
                    "fixed" as SalaryType,
                  ),
                "Tengo un sueldo fijo",
                "Mi sueldo habitual es prácticamente el mismo cada periodo.",
              )}

              {renderChoice(
                formData.salaryType ===
                  "variable",
                () =>
                  updateForm(
                    "salaryType",
                    "variable" as SalaryType,
                  ),
                "Mi sueldo es variable",
                "Recibo comisiones, pagos variables o mi ingreso cambia considerablemente.",
              )}
            </div>
          </>
        );

      case "salary":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuál es tu sueldo mensual antes
              de impuestos?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Usa el sueldo bruto que aparece en
              tu contrato o recibo de nómina.
            </p>

            {renderNumberField({
              value: salaryInput,

              onChange: (value) => {
                setSalaryInput(value);

                updateForm(
                  "monthlySalary",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "MXN",
              placeholder: "28,000",
            })}
          </>
        );

      case "variableSalary":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuál fue tu promedio diario en
              los últimos 30 días trabajados?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Incluye las percepciones variables
              que normalmente forman parte de tu
              salario.
            </p>

            {renderNumberField({
              value:
                variableSalaryInput,

              onChange: (value) => {
                setVariableSalaryInput(
                  value,
                );

                updateForm(
                  "variableDailySalary",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "por día",
              placeholder: "1,250",
            })}
          </>
        );

      case "startDate":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuándo empezaste a trabajar ahí?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Usa la fecha de ingreso de tu
              contrato o expediente laboral.
            </p>

            <DateField
              value={formData.startDate}
              onChange={(value) =>
                updateForm(
                  "startDate",
                  value,
                )
              }
            />
          </>
        );

      case "endDate":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuándo fue o será tu último día?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Esta versión usa las reglas y
              valores correspondientes a 2026.
            </p>

            <DateField
              value={formData.endDate}
              min={
                formData.startDate ||
                undefined
              }
              onChange={(value) =>
                updateForm(
                  "endDate",
                  value,
                )
              }
            />
          </>
        );

      case "contractType":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Qué tipo de contrato tienes?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              El tipo de contrato puede cambiar
              algunos escenarios de
              indemnización.
            </p>

            <div className="mt-7 space-y-3">
              {renderChoice(
                formData.contractType ===
                  "indefinite",
                () =>
                  updateForm(
                    "contractType",
                    "indefinite" as ContractType,
                  ),
                "Por tiempo indefinido",
                "No tiene una fecha establecida de terminación.",
              )}

              {renderChoice(
                formData.contractType ===
                  "fixed-less-year",
                () =>
                  updateForm(
                    "contractType",
                    "fixed-less-year" as ContractType,
                  ),
                "Por tiempo determinado menor a un año",
              )}

              {renderChoice(
                formData.contractType ===
                  "fixed-more-year",
                () =>
                  updateForm(
                    "contractType",
                    "fixed-more-year" as ContractType,
                  ),
                "Por tiempo determinado de un año o más",
              )}
            </div>
          </>
        );

      case "situation":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Qué está pasando?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              No necesitas saber cómo se llama
              legalmente.
            </p>

            <div className="mt-7 space-y-3">
              {renderChoice(
                formData.situation ===
                  "renuncia",
                () =>
                  updateForm(
                    "situation",
                    "renuncia" as Situation,
                  ),
                "Voy a renunciar",
              )}

              {renderChoice(
                formData.situation ===
                  "despido",
                () =>
                  updateForm(
                    "situation",
                    "despido" as Situation,
                  ),
                "Me despidieron",
              )}

              {renderChoice(
                formData.situation ===
                  "oferta",
                () =>
                  updateForm(
                    "situation",
                    "oferta" as Situation,
                  ),
                "Me ofrecieron dinero para salir",
              )}

              {renderChoice(
                formData.situation ===
                  "rescission-worker",
                () =>
                  updateForm(
                    "situation",
                    "rescission-worker" as Situation,
                  ),
                "Quiero salir por un problema grave con la empresa",
                "Por ejemplo, falta de pago u otro incumplimiento importante.",
              )}

              {renderChoice(
                formData.situation ===
                  "contract-end",
                () =>
                  updateForm(
                    "situation",
                    "contract-end" as Situation,
                  ),
                "Terminó mi contrato",
              )}

              {renderChoice(
                formData.situation ===
                  "no-se",
                () =>
                  updateForm(
                    "situation",
                    "no-se" as Situation,
                  ),
                "No estoy seguro",
              )}
            </div>
          </>
        );

      case "offer":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuánto te ofrecieron?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Usa el monto que te presentó la
              empresa.
            </p>

            {renderNumberField({
              value: offerInput,

              onChange: (value) => {
                setOfferInput(value);

                updateForm(
                  "employerOffer",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "MXN",
              placeholder: "50,000",
            })}
          </>
        );

      case "offerIncludes":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Ese monto ya incluye tu finiquito?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Esto cambia mucho la comparación.
            </p>

            <div className="mt-7 space-y-3">
              {renderChoice(
                formData
                  .employerOfferIncludesFiniquito ===
                  "yes",
                () =>
                  updateForm(
                    "employerOfferIncludesFiniquito",
                    "yes" as YesNoUnsure,
                  ),
                "Sí, eso es todo lo que me pagarían",
              )}

              {renderChoice(
                formData
                  .employerOfferIncludesFiniquito ===
                  "no",
                () =>
                  updateForm(
                    "employerOfferIncludesFiniquito",
                    "no" as YesNoUnsure,
                  ),
                "No, la oferta es adicional a mi finiquito",
              )}

              {renderChoice(
                formData
                  .employerOfferIncludesFiniquito ===
                  "unsure",
                () =>
                  updateForm(
                    "employerOfferIncludesFiniquito",
                    "unsure" as YesNoUnsure,
                  ),
                "No estoy seguro",
                "Te mostraremos las dos interpretaciones para no asumir.",
              )}
            </div>
          </>
        );

      case "employerCause":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿La empresa dice que te despidió
              por una falta tuya?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              No estamos determinando si esa
              causa es válida.
            </p>

            <div className="mt-7 space-y-3">
              {renderChoice(
                formData
                  .employerClaimsCause ===
                  "no",
                () =>
                  updateForm(
                    "employerClaimsCause",
                    "no" as YesNoUnsure,
                  ),
                "No",
              )}

              {renderChoice(
                formData
                  .employerClaimsCause ===
                  "yes",
                () =>
                  updateForm(
                    "employerClaimsCause",
                    "yes" as YesNoUnsure,
                  ),
                "Sí",
              )}

              {renderChoice(
                formData
                  .employerClaimsCause ===
                  "unsure",
                () =>
                  updateForm(
                    "employerClaimsCause",
                    "unsure" as YesNoUnsure,
                  ),
                "No estoy seguro",
              )}
            </div>
          </>
        );

      case "unpaidSalary":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuántos días trabajados todavía no
              te han pagado?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Si ya recibiste tu sueldo hasta el
              último día pagado, deja 0.
            </p>

            <div className="mt-7 flex items-center rounded-xl border border-[#ccd5dc] px-4">
              <input
                autoFocus
                type="number"
                min="0"
                step="1"
                value={
                  formData.unpaidSalaryDays
                }
                onChange={(event) =>
                  updateForm(
                    "unpaidSalaryDays",
                    Math.max(
                      0,
                      Number(
                        event.target.value,
                      ) || 0,
                    ),
                  )
                }
                className="w-full bg-transparent py-4 text-2xl font-semibold outline-none"
              />

              <span className="text-sm text-[#8a949c]">
                días
              </span>
            </div>
          </>
        );

      case "aguinaldoDays":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuántos días de aguinaldo te
              corresponden al año?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Si recibes el mínimo legal, deja
              15.
            </p>

            <div className="mt-7 flex items-center rounded-xl border border-[#ccd5dc] px-4">
              <input
                autoFocus
                type="number"
                min="15"
                step="1"
                value={
                  formData.aguinaldoDaysPerYear
                }
                onChange={(event) =>
                  updateForm(
                    "aguinaldoDaysPerYear",
                    Number(
                      event.target.value,
                    ) || 0,
                  )
                }
                className="w-full bg-transparent py-4 text-2xl font-semibold outline-none"
              />

              <span className="text-sm text-[#8a949c]">
                días
              </span>
            </div>
          </>
        );

      case "aguinaldoPaid":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuánto aguinaldo de 2026 ya te
              pagaron?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Si todavía no te han pagado nada,
              deja 0.
            </p>

            {renderNumberField({
              value:
                aguinaldoPaidInput,

              onChange: (value) => {
                setAguinaldoPaidInput(
                  value,
                );

                updateForm(
                  "aguinaldoAlreadyPaid",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "MXN",
              placeholder: "0",
            })}
          </>
        );

      case "vacationPremium":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Qué porcentaje de prima vacacional
              recibes?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Si recibes el mínimo legal, deja
              25%.
            </p>

            <div className="mt-7 flex items-center rounded-xl border border-[#ccd5dc] px-4">
              <input
                autoFocus
                type="number"
                min="25"
                step="1"
                value={
                  formData.vacationPremiumRate *
                  100
                }
                onChange={(event) =>
                  updateForm(
                    "vacationPremiumRate",
                    (Number(
                      event.target.value,
                    ) || 0) / 100,
                  )
                }
                className="w-full bg-transparent py-4 text-2xl font-semibold outline-none"
              />

              <span className="text-[#8a949c]">
                %
              </span>
            </div>
          </>
        );

      case "previousVacations":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Tienes vacaciones pendientes de
              periodos anteriores?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              No incluyas las del periodo actual;
              Cuenta Clara calcula esa parte
              automáticamente.
            </p>

            <div className="mt-7 flex items-center rounded-xl border border-[#ccd5dc] px-4">
              <input
                autoFocus
                type="number"
                min="0"
                step="0.5"
                value={
                  formData
                    .previousPendingVacationDays
                }
                onChange={(event) =>
                  updateForm(
                    "previousPendingVacationDays",
                    Math.max(
                      0,
                      Number(
                        event.target.value,
                      ) || 0,
                    ),
                  )
                }
                className="w-full bg-transparent py-4 text-2xl font-semibold outline-none"
              />

              <span className="text-sm text-[#8a949c]">
                días
              </span>
            </div>
          </>
        );

      case "currentVacationsUsed":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Cuántos días de vacaciones ya
              utilizaste de tu periodo actual?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Los descontaremos del proporcional
              generado.
            </p>

            <div className="mt-7 flex items-center rounded-xl border border-[#ccd5dc] px-4">
              <input
                autoFocus
                type="number"
                min="0"
                step="0.5"
                value={
                  formData
                    .currentVacationDaysAlreadyUsed
                }
                onChange={(event) =>
                  updateForm(
                    "currentVacationDaysAlreadyUsed",
                    Math.max(
                      0,
                      Number(
                        event.target.value,
                      ) || 0,
                    ),
                  )
                }
                className="w-full bg-transparent py-4 text-2xl font-semibold outline-none"
              />

              <span className="text-sm text-[#8a949c]">
                días
              </span>
            </div>
          </>
        );

      case "ptu":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Sabes si tienes PTU pendiente de
              pago?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Si conoces el monto, escríbelo. Si
              no, deja 0.
            </p>

            {renderNumberField({
              value: ptuInput,

              onChange: (value) => {
                setPtuInput(value);

                updateForm(
                  "knownPendingPTU",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "MXN",
              placeholder: "0",
            })}
          </>
        );

      case "otherBenefits":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Te deben alguna otra prestación o
              cantidad ya generada?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Por ejemplo, bonos ya ganados,
              comisiones pendientes u otra
              cantidad que ya te deban.
            </p>

            {renderNumberField({
              value:
                otherBenefitsInput,

              onChange: (value) => {
                setOtherBenefitsInput(
                  value,
                );

                updateForm(
                  "otherPendingBenefits",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "MXN",
              placeholder: "0",
            })}
          </>
        );

      case "integratedBenefits":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Recibes alguna cantidad diaria
              adicional que forme parte de tu
              salario?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Úsalo solo si sabes que esa cantidad
              debe integrar tu salario para una
              indemnización.
            </p>

            {renderNumberField({
              value:
                integratedBenefitsInput,

              onChange: (value) => {
                setIntegratedBenefitsInput(
                  value,
                );

                updateForm(
                  "additionalIntegratedDailyAmount",
                  parseNumberInput(value),
                );
              },

              prefix: "$",
              suffix: "por día",
              placeholder: "0",
            })}

            <p className="mt-3 text-xs leading-5 text-[#8a949c]">
              Si no sabes, deja 0. Es mejor no
              inventar este dato.
            </p>
          </>
        );

      case "zone":
        return (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">
              ¿Tu centro de trabajo está en la
              Zona Libre de la Frontera Norte?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#71808a]">
              Esto puede cambiar el límite usado
              para la prima de antigüedad.
            </p>

            <div className="mt-7 space-y-3">
              {renderChoice(
                formData.salaryZone ===
                  "general",
                () =>
                  updateForm(
                    "salaryZone",
                    "general" as SalaryZone,
                  ),
                "No",
                "Usaremos el salario mínimo general.",
              )}

              {renderChoice(
                formData.salaryZone ===
                  "border",
                () =>
                  updateForm(
                    "salaryZone",
                    "border" as SalaryZone,
                  ),
                "Sí",
                "Zona Libre de la Frontera Norte.",
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#17212b]">
      <header className="border-b border-[#dfe5ea] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#163d4f] text-sm font-bold text-white">
              C
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Cuenta Clara
            </span>
          </div>

          <span className="text-sm text-[#6b7680]">
            México
          </span>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-14 lg:grid-cols-[1fr_470px] lg:items-center lg:py-20">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-medium text-[#2b6f86]">
            Antes de aceptar o firmar
          </p>

          <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
            Ponle números a tu salida del trabajo.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f6b75]">
            Responde unas preguntas sencillas y
            entiende qué dinero está en juego
            antes de tomar una decisión.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#66727c]">
            <span>Finiquito</span>
            <span>Liquidación</span>
            <span>Oferta de salida</span>
          </div>
        </div>

        <Calculator>
          {currentStep !== "result" &&
            currentStep !== "loading" && (
              <div className="h-1 bg-[#edf1f3]">
                <div
                  className="h-full bg-[#2b6f86] transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            )}

          <div className="p-6 sm:p-7">
            {currentStep === "loading" && (
              <CalculationLoader />
            )}

            {currentStep === "result" &&
              result && (
                <Results
                  data={formData}
                  result={result}
                  onEdit={editAnswers}
                  onRestart={restart}
                />
              )}

            {currentStep === "summary" && (
              <div className="animate-result-enter">
                <p className="text-sm font-medium text-[#2b6f86]">
                  Revisa antes de calcular
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#17212b]">
                  ¿Todo se ve bien?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#71808a]">
                  Estos son los datos principales
                  que usaremos para hacer tu
                  estimación.
                </p>

                <div className="mt-6 divide-y divide-[#e7ecef] overflow-hidden rounded-xl border border-[#dce3e8]">
                  <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                    <span className="text-sm text-[#65727c]">
                      Sueldo mensual
                    </span>

                    <strong className="text-sm text-[#17212b]">
                      {money(
                        formData.monthlySalary,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                    <span className="text-sm text-[#65727c]">
                      Ingreso
                    </span>

                    <strong className="text-right text-sm text-[#17212b]">
                      {formatDateMX(
                        formData.startDate,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                    <span className="text-sm text-[#65727c]">
                      Salida
                    </span>

                    <strong className="text-right text-sm text-[#17212b]">
                      {formatDateMX(
                        formData.endDate,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                    <span className="text-sm text-[#65727c]">
                      Contrato
                    </span>

                    <strong className="max-w-[230px] text-right text-sm text-[#17212b]">
                      {getContractLabel(
                        formData.contractType,
                      )}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                    <span className="text-sm text-[#65727c]">
                      Situación
                    </span>

                    <strong className="max-w-[230px] text-right text-sm text-[#17212b]">
                      {getSituationLabel(
                        formData.situation,
                      )}
                    </strong>
                  </div>

                  {formData.situation ===
                    "oferta" &&
                    formData.employerOffer && (
                      <div className="flex items-center justify-between gap-5 px-4 py-3.5">
                        <span className="text-sm text-[#65727c]">
                          Oferta
                        </span>

                        <strong className="text-sm text-[#17212b]">
                          {money(
                            formData.employerOffer,
                          )}
                        </strong>
                      </div>
                    )}
                </div>

                {error && (
                  <p className="mt-5 rounded-lg bg-[#fff3f1] px-4 py-3 text-sm text-[#a0473d]">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={
                    calculateFromSummary
                  }
                  className="mt-7 w-full rounded-lg bg-[#163d4f] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102f3d]"
                >
                  Calcular mi salida
                </button>

                <button
                  type="button"
                  onClick={editAnswers}
                  className="mt-3 w-full rounded-lg border border-[#ccd5dc] px-5 py-3.5 text-sm font-semibold text-[#17212b] transition hover:bg-[#f7f9fb]"
                >
                  Cambiar algún dato
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-[#8a949c]">
                  Tus respuestas se guardan
                  únicamente en este navegador para
                  que no pierdas tu avance.
                </p>
              </div>
            )}

            {currentStep !== "loading" &&
              currentStep !== "result" &&
              currentStep !==
                "summary" && (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#8a949c]">
                      Paso{" "}
                      {questionIndex + 1} de{" "}
                      {
                        questionSteps.length
                      }
                    </span>

                    {currentStepIndex >
                      0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="text-sm text-[#63727c] transition hover:text-[#17212b]"
                      >
                        Atrás
                      </button>
                    )}
                  </div>

                  <Question
                    animationKey={`${currentStep}-${currentStepIndex}`}
                    direction={direction}
                  >
                    {questionContent()}
                  </Question>

                  {error && (
                    <p className="mt-5 rounded-lg bg-[#fff3f1] px-4 py-3 text-sm text-[#a0473d]">
                      {error}
                    </p>
                  )}

                  {![
                    "salaryType",
                    "contractType",
                    "situation",
                    "offerIncludes",
                    "employerCause",
                    "zone",
                  ].includes(
                    currentStep,
                  ) && (
                    <button
                      type="button"
                      onClick={goNext}
                      className="mt-7 w-full rounded-lg bg-[#163d4f] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102f3d]"
                    >
                      Continuar
                    </button>
                  )}

                  <p className="mt-4 text-center text-xs leading-5 text-[#8a949c]">
                    Tus respuestas se guardan
                    únicamente en este navegador
                    para que no pierdas tu avance.
                  </p>
                </>
              )}
          </div>
        </Calculator>
      </section>

      {currentStep === "result" && (
        <MexicoNumbersBubble />
      )}

      <SiteFooter />
    </main>
  );
}