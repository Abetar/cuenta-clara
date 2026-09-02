"use client";

import type {
  CalculatorFormData,
  LaborCalculationResult,
} from "@/lib/calculator/types";

interface ResultsProps {
  data: CalculatorFormData;
  result: LaborCalculationResult;
  onEdit: () => void;
  onRestart: () => void;
}

function money(value: number) {
  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function decimalMoney(
  value: number,
) {
  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  if (value <= 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-5 px-4 py-4">
      <span className="text-sm text-[#65727c]">
        {label}
      </span>

      <strong className="text-right text-[#17212b]">
        {money(value)}
      </strong>
    </div>
  );
}

function LegalSource({
  title,
  articles,
  description,
}: {
  title: string;
  articles: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-[#f7f9fb] px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-medium text-[#17212b]">
          {title}
        </span>

        <span className="shrink-0 text-xs font-medium text-[#2b6f86]">
          {articles}
        </span>
      </div>

      <p className="mt-1 text-xs leading-5 text-[#7a858e]">
        {description}
      </p>
    </div>
  );
}

function DifferenceMessage({
  difference,
}: {
  difference: number;
}) {
  if (
    Math.abs(difference) < 1
  ) {
    return (
      <p className="text-sm leading-6 text-[#65727c]">
        La oferta es
        prácticamente igual a
        los derechos pendientes
        que estimamos.
      </p>
    );
  }

  return (
    <p className="text-sm leading-6 text-[#65727c]">
      La oferta está
      aproximadamente{" "}
      <strong className="text-[#17212b]">
        {money(
          Math.abs(difference),
        )}
      </strong>{" "}
      {difference >= 0
        ? "por encima"
        : "por debajo"}{" "}
      de los derechos pendientes
      que podemos estimar.
    </p>
  );
}

export default function Results({
  data,
  result,
  onEdit,
  onRestart,
}: ResultsProps) {
  const isDismissal =
    data.situation ===
    "despido";

  const isOffer =
    data.situation ===
    "oferta";

  const offer = Math.max(
    0,
    data.employerOffer ?? 0,
  );

  const offerIncludes =
    data
      .employerOfferIncludesFiniquito;

  const offerAsTotalDifference =
    offer -
    result.earnedRightsTotal;

  const offerPlusFiniquito =
    offer +
    result.earnedRightsTotal;

  return (
    <div className="animate-result-enter">
      <p className="text-sm font-medium text-[#2b6f86]">
        Tu estimación
      </p>

      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#17212b]">
        {isDismissal
          ? money(
              result
                .referenceTotals
                .dismissalThreeMonthScenario,
            )
          : money(
              result.earnedRightsTotal,
            )}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#71808a]">
        {isDismissal
          ? "Este es un escenario de referencia que considera tus derechos pendientes y tres meses de salario integrado."
          : "Esta es nuestra estimación de los derechos pendientes que podemos calcular con la información que proporcionaste."}
      </p>

      <div className="mt-7 divide-y divide-[#e7ecef] overflow-hidden rounded-xl border border-[#dce3e8]">
        <ResultRow
          label="Sueldo pendiente"
          value={
            result.unpaidSalary
          }
        />

        <ResultRow
          label="Aguinaldo pendiente"
          value={
            result.aguinaldo
              .pendingAmount
          }
        />

        <ResultRow
          label="Vacaciones pendientes"
          value={
            result.vacations
              .vacationPay
          }
        />

        <ResultRow
          label="Prima vacacional"
          value={
            result.vacations
              .vacationPremium
          }
        />

        <ResultRow
          label="Prima de antigüedad"
          value={
            result.seniority
              .amount
          }
        />

        <ResultRow
          label="PTU pendiente"
          value={
            result.pendingPTU
          }
        />

        <ResultRow
          label="Otras prestaciones pendientes"
          value={
            result.otherPendingBenefits
          }
        />

        <div className="flex items-center justify-between gap-5 bg-[#f7f9fb] px-4 py-4">
          <span className="font-medium text-[#17212b]">
            Derechos pendientes
            estimados
          </span>

          <strong className="text-lg text-[#17212b]">
            {money(
              result.earnedRightsTotal,
            )}
          </strong>
        </div>
      </div>

      {isDismissal && (
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-[#b8ccd5] bg-[#f2f7f9] p-4">
            <p className="text-sm font-medium text-[#2b6f86]">
              Escenario con tres
              meses
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#17212b]">
              {money(
                result
                  .referenceTotals
                  .dismissalThreeMonthScenario,
              )}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#71808a]">
              Es un escenario de
              referencia para un
              despido tratado como
              injustificado. No
              significa por sí solo
              que jurídicamente te
              corresponda este
              monto.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-[#c7d1d7] p-4">
            <p className="text-sm font-medium text-[#17212b]">
              Escenario adicional
              del artículo 50
            </p>

            <p className="mt-1 text-xl font-semibold text-[#17212b]">
              {money(
                result
                  .referenceTotals
                  .article50ReferenceScenario,
              )}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#71808a]">
              Lo mostramos por
              separado porque la
              indemnización del
              artículo 50 no debe
              sumarse
              automáticamente a
              cualquier despido.
            </p>
          </div>
        </div>
      )}

      {isOffer &&
        offer > 0 &&
        offerIncludes ===
          "yes" && (
          <div className="mt-6 rounded-xl bg-[#f7f9fb] p-5">
            <p className="text-sm font-medium text-[#17212b]">
              La oferta de tu
              empresa
            </p>

            <p className="mt-1 text-xs leading-5 text-[#7a858e]">
              Nos indicaste que
              este monto ya
              incluye tu
              finiquito.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm text-[#65727c]">
                Oferta total
              </span>

              <strong>
                {money(offer)}
              </strong>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-[#65727c]">
                Derechos
                estimados
              </span>

              <strong>
                {money(
                  result.earnedRightsTotal,
                )}
              </strong>
            </div>

            <div className="mt-4 border-t border-[#dce3e8] pt-4">
              <DifferenceMessage
                difference={
                  offerAsTotalDifference
                }
              />
            </div>
          </div>
        )}

      {isOffer &&
        offer > 0 &&
        offerIncludes ===
          "no" && (
          <div className="mt-6 rounded-xl bg-[#f7f9fb] p-5">
            <p className="text-sm font-medium text-[#17212b]">
              Oferta adicional a
              tu finiquito
            </p>

            <p className="mt-1 text-xs leading-5 text-[#7a858e]">
              Nos indicaste que la
              empresa pagaría esta
              oferta además de tus
              derechos pendientes.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm text-[#65727c]">
                Derechos
                estimados
              </span>

              <strong>
                {money(
                  result.earnedRightsTotal,
                )}
              </strong>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-[#65727c]">
                Oferta adicional
              </span>

              <strong>
                {money(offer)}
              </strong>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#dce3e8] pt-4">
              <span className="font-medium text-[#17212b]">
                Total estimado
              </span>

              <strong className="text-lg text-[#17212b]">
                {money(
                  offerPlusFiniquito,
                )}
              </strong>
            </div>
          </div>
        )}

      {isOffer &&
        offer > 0 &&
        offerIncludes ===
          "unsure" && (
          <div className="mt-6">
            <div className="rounded-xl border border-[#dce3e8] p-5">
              <p className="text-sm font-medium text-[#17212b]">
                Hay dos formas de
                interpretar la
                oferta
              </p>

              <p className="mt-2 text-sm leading-6 text-[#71808a]">
                Como no sabes si
                el monto incluye
                tu finiquito, no
                vamos a asumirlo.
              </p>
            </div>

            <div className="mt-3 rounded-xl border border-[#b8ccd5] bg-[#f2f7f9] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2b6f86]">
                Si la oferta ya
                incluye tu
                finiquito
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-[#65727c]">
                  Oferta total
                </span>

                <strong>
                  {money(offer)}
                </strong>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-sm text-[#65727c]">
                  Derechos
                  estimados
                </span>

                <strong>
                  {money(
                    result.earnedRightsTotal,
                  )}
                </strong>
              </div>

              <div className="mt-4 border-t border-[#d4e1e6] pt-4">
                <DifferenceMessage
                  difference={
                    offerAsTotalDifference
                  }
                />
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-dashed border-[#c7d1d7] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#65727c]">
                Si la oferta es
                adicional a tu
                finiquito
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-[#65727c]">
                  Derechos
                  estimados
                </span>

                <strong>
                  {money(
                    result.earnedRightsTotal,
                  )}
                </strong>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-sm text-[#65727c]">
                  Oferta adicional
                </span>

                <strong>
                  {money(offer)}
                </strong>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#e1e7eb] pt-4">
                <span className="font-medium text-[#17212b]">
                  Total
                </span>

                <strong className="text-lg text-[#17212b]">
                  {money(
                    offerPlusFiniquito,
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}

      <details className="mt-6 rounded-xl border border-[#e1e7eb] p-4">
        <summary className="cursor-pointer text-sm font-medium text-[#17212b]">
          Ver cómo hicimos el
          cálculo
        </summary>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8a949c]">
            Datos utilizados
          </p>

          <div className="mt-3 space-y-2 text-sm leading-6 text-[#71808a]">
            <p>
              Sueldo diario:{" "}
              <strong className="font-medium text-[#17212b]">
                {decimalMoney(
                  result.dailySalary,
                )}
              </strong>
            </p>

            <p>
              Salario diario
              integrado
              estimado:{" "}
              <strong className="font-medium text-[#17212b]">
                {decimalMoney(
                  result.integratedDailySalary,
                )}
              </strong>
            </p>

            <p>
              Antigüedad:{" "}
              <strong className="font-medium text-[#17212b]">
                {result.employment.exactYears.toFixed(
                  2,
                )}{" "}
                años
              </strong>
            </p>

            <p>
              Aguinaldo
              generado:{" "}
              <strong className="font-medium text-[#17212b]">
                {result.aguinaldo.generatedDays.toFixed(
                  2,
                )}{" "}
                días
              </strong>
            </p>

            <p>
              Vacaciones
              generadas en el
              periodo actual:{" "}
              <strong className="font-medium text-[#17212b]">
                {result.vacations.currentPeriodGeneratedDays.toFixed(
                  2,
                )}{" "}
                días
              </strong>
            </p>

            <p>
              Vacaciones
              pendientes
              totales:{" "}
              <strong className="font-medium text-[#17212b]">
                {result.vacations.totalPendingDays.toFixed(
                  2,
                )}{" "}
                días
              </strong>
            </p>

            {result.seniority
              .applies && (
              <p>
                Salario diario
                usado para prima
                de antigüedad:{" "}
                <strong className="font-medium text-[#17212b]">
                  {decimalMoney(
                    result.seniority.applicableDailySalary,
                  )}
                </strong>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-[#e7ecef] pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8a949c]">
            Base legal
          </p>

          <p className="mt-2 text-xs leading-5 text-[#7a858e]">
            Principales
            disposiciones de la
            Ley Federal del
            Trabajo utilizadas
            como referencia.
          </p>

          <div className="mt-4 space-y-2">
            <LegalSource
              title="Aguinaldo"
              articles="LFT art. 87"
              description="Establece el aguinaldo mínimo y el pago proporcional cuando no se completa el año."
            />

            <LegalSource
              title="Vacaciones y prima vacacional"
              articles="LFT arts. 76, 79 y 80"
              description="Regulan los días de vacaciones, la parte proporcional al terminar la relación y la prima vacacional."
            />

            <LegalSource
              title="Prima de antigüedad"
              articles="LFT art. 162"
              description="Establece los principales supuestos para el pago de la prima de antigüedad."
            />

            <LegalSource
              title="Indemnizaciones"
              articles="LFT arts. 48, 49 y 50"
              description="Regulan escenarios de reinstalación e indemnización derivados de determinadas terminaciones laborales."
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-[#8a949c]">
            La aplicación de cada
            disposición depende de
            las circunstancias
            concretas de la
            relación laboral.
          </p>
        </div>
      </details>

      {result.warnings.length >
        0 && (
        <div className="mt-6 rounded-xl bg-[#fff8e8] p-4">
          <p className="text-sm font-medium text-[#6e6043]">
            Antes de tomar una
            decisión
          </p>

          <div className="mt-2 space-y-2 text-xs leading-5 text-[#7b6b49]">
            {result.warnings.map(
              (warning) => (
                <p key={warning}>
                  {warning}
                </p>
              ),
            )}
          </div>
        </div>
      )}

      <p className="mt-5 text-center text-xs leading-5 text-[#8a949c]">
        Estimación informativa.
        Los montos son brutos
        antes de impuestos y no
        sustituyen asesoría
        laboral.
      </p>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onEdit}
          className="w-full rounded-lg bg-[#163d4f] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#102f3d]"
        >
          Cambiar mis datos
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-lg border border-[#ccd5dc] px-5 py-3.5 text-sm font-semibold text-[#17212b] transition hover:bg-[#f7f9fb]"
        >
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}