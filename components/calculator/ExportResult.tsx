"use client";

import type {
  CalculatorFormData,
  LaborCalculationResult,
} from "@/lib/calculator/types";

interface ExportResultProps {
  data: CalculatorFormData;
  result: LaborCalculationResult;
}

function money(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function decimalMoney(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "—";

  const [year, month, day] = value.split("-");

  return `${day}/${month}/${year}`;
}

function getSituationLabel(value: CalculatorFormData["situation"]) {
  switch (value) {
    case "renuncia":
      return "Renuncia";
    case "despido":
      return "Despido";
    case "oferta":
      return "Oferta de salida";
    case "rescission-worker":
      return "Salida por incumplimiento de la empresa";
    case "contract-end":
      return "Terminación de contrato";
    case "no-se":
      return "Situación por definir";
    default:
      return "—";
  }
}

function getContractLabel(value: CalculatorFormData["contractType"]) {
  switch (value) {
    case "indefinite":
      return "Tiempo indefinido";
    case "fixed-less-year":
      return "Tiempo determinado menor a un año";
    case "fixed-more-year":
      return "Tiempo determinado de un año o más";
    default:
      return "—";
  }
}

function Row({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  if (value <= 0) return null;

  return (
    <div className="flex items-center justify-between gap-8 border-b border-[#e5ebee] py-3.5 last:border-none">
      <span className="text-sm text-[#63717b]">{label}</span>

      <strong className="text-sm text-[#17212b]">
        {money(value)}
      </strong>
    </div>
  );
}

export default function ExportResult({
  data,
  result,
}: ExportResultProps) {
  const isDismissal = data.situation === "despido";

  const mainTotal = isDismissal
    ? result.referenceTotals.dismissalThreeMonthScenario
    : result.earnedRightsTotal;

  const generatedAt = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <div
      id="cuenta-clara-export"
      className="w-[794px] bg-[#f7f9fb] p-10 text-[#17212b]"
    >
      <div className="overflow-hidden rounded-[24px] border border-[#dce3e8] bg-white">
        <div className="border-b border-[#e1e7eb] px-9 py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163d4f] text-lg font-bold text-white">
                C
              </div>

              <div>
                <p className="text-xl font-semibold tracking-tight">
                  Cuenta Clara
                </p>

                <p className="text-xs text-[#849099]">
                  Resumen de tu estimación laboral
                </p>
              </div>
            </div>

            <p className="text-xs text-[#8a949c]">
              {generatedAt}
            </p>
          </div>
        </div>

        <div className="px-9 py-8">
          <p className="text-sm font-medium text-[#2b6f86]">
            Total estimado
          </p>

          <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
            {money(mainTotal)}
          </p>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#697782]">
            {isDismissal
              ? "Escenario de referencia que considera tus derechos pendientes y tres meses de salario integrado."
              : "Estimación de los derechos pendientes calculados con la información proporcionada."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#f7f9fb] p-4">
              <p className="text-xs text-[#859099]">Sueldo mensual</p>
              <p className="mt-1 font-semibold">
                {money(data.monthlySalary)}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f9fb] p-4">
              <p className="text-xs text-[#859099]">Situación</p>
              <p className="mt-1 font-semibold">
                {getSituationLabel(data.situation)}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f9fb] p-4">
              <p className="text-xs text-[#859099]">Fecha de ingreso</p>
              <p className="mt-1 font-semibold">
                {formatDate(data.startDate)}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f9fb] p-4">
              <p className="text-xs text-[#859099]">Fecha de salida</p>
              <p className="mt-1 font-semibold">
                {formatDate(data.endDate)}
              </p>
            </div>

            <div className="col-span-2 rounded-xl bg-[#f7f9fb] p-4">
              <p className="text-xs text-[#859099]">Contrato</p>
              <p className="mt-1 font-semibold">
                {getContractLabel(data.contractType)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a949c]">
              Derechos pendientes
            </p>

            <div className="mt-3 rounded-xl border border-[#dce3e8] px-5">
              <Row
                label="Sueldo pendiente"
                value={result.unpaidSalary}
              />

              <Row
                label="Aguinaldo pendiente"
                value={result.aguinaldo.pendingAmount}
              />

              <Row
                label="Vacaciones pendientes"
                value={result.vacations.vacationPay}
              />

              <Row
                label="Prima vacacional"
                value={result.vacations.vacationPremium}
              />

              <Row
                label="Prima de antigüedad"
                value={result.seniority.amount}
              />

              <Row
                label="PTU pendiente"
                value={result.pendingPTU}
              />

              <Row
                label="Otras prestaciones"
                value={result.otherPendingBenefits}
              />

              <div className="flex items-center justify-between gap-8 py-4">
                <span className="font-semibold">
                  Derechos pendientes estimados
                </span>

                <strong className="text-lg">
                  {money(result.earnedRightsTotal)}
                </strong>
              </div>
            </div>
          </div>

          {isDismissal && (
            <div className="mt-7 space-y-3">
              <div className="rounded-xl border border-[#b8ccd5] bg-[#f2f7f9] p-5">
                <p className="text-sm font-medium text-[#2b6f86]">
                  Escenario con tres meses
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {money(
                    result.referenceTotals.dismissalThreeMonthScenario,
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#71808a]">
                  Escenario de referencia para un despido tratado como
                  injustificado.
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-[#c7d1d7] p-5">
                <p className="text-sm font-medium">
                  Escenario adicional del artículo 50
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {money(
                    result.referenceTotals.article50ReferenceScenario,
                  )}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#71808a]">
                  Se presenta por separado porque no debe sumarse
                  automáticamente a cualquier despido.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-xl bg-[#f7f9fb] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a949c]">
              Datos utilizados
            </p>

            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <p className="text-[#6e7a84]">
                Sueldo diario
                <strong className="ml-2 font-medium text-[#17212b]">
                  {decimalMoney(result.dailySalary)}
                </strong>
              </p>

              <p className="text-[#6e7a84]">
                Salario diario integrado
                <strong className="ml-2 font-medium text-[#17212b]">
                  {decimalMoney(result.integratedDailySalary)}
                </strong>
              </p>

              <p className="text-[#6e7a84]">
                Antigüedad
                <strong className="ml-2 font-medium text-[#17212b]">
                  {result.employment.exactYears.toFixed(2)} años
                </strong>
              </p>

              <p className="text-[#6e7a84]">
                Aguinaldo generado
                <strong className="ml-2 font-medium text-[#17212b]">
                  {result.aguinaldo.generatedDays.toFixed(2)} días
                </strong>
              </p>

              <p className="text-[#6e7a84]">
                Vacaciones generadas
                <strong className="ml-2 font-medium text-[#17212b]">
                  {result.vacations.currentPeriodGeneratedDays.toFixed(2)} días
                </strong>
              </p>

              <p className="text-[#6e7a84]">
                Vacaciones pendientes
                <strong className="ml-2 font-medium text-[#17212b]">
                  {result.vacations.totalPendingDays.toFixed(2)} días
                </strong>
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-[#e4e9ec] pt-6">
            <p className="text-xs leading-5 text-[#8a949c]">
              Esta estimación es informativa, utiliza montos brutos antes
              de impuestos y no sustituye asesoría legal, laboral o fiscal.
              La aplicación de cada disposición depende de las
              circunstancias específicas del caso.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs font-medium text-[#163d4f]">
                Cuenta Clara
              </p>

              <p className="text-xs text-[#8a949c]">
                cuenta-clara-psi.vercel.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}