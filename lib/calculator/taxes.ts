import type { TaxEstimate } from "./types";

export function estimateTerminationTaxes(
  grossAmount: number,
): TaxEstimate {
  /*
   * IMPORTANTE:
   *
   * Todavía NO calculamos ISR.
   *
   * Los pagos por separación, salarios, aguinaldo,
   * prima vacacional y otros conceptos no necesariamente
   * tienen el mismo tratamiento fiscal.
   *
   * Además, un cálculo serio necesita separar cada concepto
   * antes de aplicar exenciones, retenciones y el procedimiento
   * fiscal correspondiente.
   *
   * Hasta cerrar y probar ese motor fiscal, Cuenta Clara
   * mostrará resultados brutos.
   */

  return {
    supported: false,

    grossAmount,

    estimatedTax: null,
    estimatedNet: null,

    message:
      "Por ahora mostramos montos brutos antes de ISR. La estimación fiscal se incorporará cuando podamos calcular cada concepto con su tratamiento correspondiente.",
  };
}