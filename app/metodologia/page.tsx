import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Conoce cómo Cuenta Clara estima finiquitos, indemnizaciones y derechos laborales en México.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#e1e7eb] py-9 first:border-0 first:pt-0">
      <h2 className="text-xl font-semibold tracking-tight text-[#17212b]">
        {title}
      </h2>

      <div className="mt-4 text-sm leading-7 text-[#65727c]">
        {children}
      </div>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fb] text-[#17212b]">
      <header className="border-b border-[#dfe5ea] bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#163d4f] text-sm font-bold text-white">
              C
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Cuenta Clara
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm text-[#63727c] transition hover:text-[#17212b]"
          >
            Volver a la calculadora
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <p className="text-sm font-medium text-[#2b6f86]">
          Transparencia
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Cómo hacemos los cálculos
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#65727c]">
          Cuenta Clara busca convertir las principales reglas
          económicas de una terminación laboral en una estimación
          entendible. Aquí explicamos qué usamos, qué asumimos y qué
          no podemos determinar.
        </p>

        <div className="mt-12 rounded-2xl border border-[#dce3e8] bg-white p-6 sm:p-8">
          <Section title="¿Quién hizo Cuenta Clara?">
            <p>
              Cuenta Clara es un proyecto independiente creado por{" "}
              <a
                href="https://agsolutions.dev"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#2b6f86] underline decoration-[#b9d0da] underline-offset-4"
              >
                AG Solutions
              </a>
              .
            </p>

            <p className="mt-3">
              No tenemos afiliación con la Secretaría del Trabajo,
              PROFEDET, el Poder Judicial, despachos laborales,
              sindicatos ni empleadores.
            </p>

            <p className="mt-3">
              El resultado es una estimación informativa y no
              sustituye la revisión de un profesional.
            </p>
          </Section>

          <Section title="Ley Federal del Trabajo utilizada">
            <p>
              El motor utiliza como referencia la Ley Federal del
              Trabajo publicada por la Cámara de Diputados y vigente
              para los cálculos soportados por esta versión.
            </p>

            <div className="mt-5 overflow-hidden rounded-xl border border-[#e1e7eb]">
              <div className="grid grid-cols-[90px_1fr] bg-[#f7f9fb] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#7c8992]">
                <span>Artículo</span>
                <span>Uso en Cuenta Clara</span>
              </div>

              {[
                ["47", "Causas legales de rescisión sin responsabilidad para el patrón."],
                ["48", "Escenario de indemnización constitucional de tres meses en despido."],
                ["49 y 50", "Supuestos y fórmulas adicionales de indemnización."],
                ["51 y 52", "Separación de la persona trabajadora por causas imputables al patrón."],
                ["76 y 79", "Vacaciones y pago proporcional al terminar la relación laboral."],
                ["80", "Prima vacacional, con mínimo legal de 25%."],
                ["84 y 89", "Integración y base salarial utilizada para determinados cálculos indemnizatorios."],
                ["87", "Aguinaldo y parte proporcional."],
                ["162", "Prima de antigüedad y principales supuestos de procedencia."],
              ].map(([article, description]) => (
                <div
                  key={article}
                  className="grid grid-cols-[90px_1fr] gap-3 border-t border-[#e7ecef] px-4 py-3.5"
                >
                  <strong className="text-[#17212b]">
                    {article}
                  </strong>

                  <span>{description}</span>
                </div>
              ))}
            </div>

            <p className="mt-5">
              Puedes consultar el texto vigente directamente en la{" "}
              <a
                href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#2b6f86] underline decoration-[#b9d0da] underline-offset-4"
              >
                Cámara de Diputados
              </a>
              .
            </p>
          </Section>

          <Section title="Cómo calculamos el salario diario">
            <p>
              Para sueldo mensual fijo utilizamos la división entre
              30 días.
            </p>

            <div className="mt-4 rounded-xl bg-[#f7f9fb] p-4 font-mono text-sm text-[#17212b]">
              salario diario = sueldo mensual ÷ 30
            </div>

            <p className="mt-4">
              Cuando el salario es variable, Cuenta Clara solicita el
              promedio diario correspondiente para utilizarlo como
              base. La precisión depende de que el dato capturado
              represente correctamente las percepciones aplicables.
            </p>
          </Section>

          <Section title="Aguinaldo">
            <p>
              Se calcula la parte proporcional generada durante el año
              calendario de terminación utilizando los días de
              aguinaldo proporcionados por la persona usuaria, nunca
              por debajo del mínimo legal soportado por la
              calculadora.
            </p>

            <p className="mt-3">
              Si ya se recibió parte del aguinaldo, ese monto se
              descuenta de la cantidad generada.
            </p>
          </Section>

          <Section title="Vacaciones y prima vacacional">
            <p>
              La calculadora determina los días que corresponden de
              acuerdo con la antigüedad y estima la parte proporcional
              generada durante el periodo de servicio actual.
            </p>

            <p className="mt-3">
              También permite indicar vacaciones pendientes de
              periodos anteriores y días ya disfrutados del periodo
              actual.
            </p>

            <p className="mt-3">
              Sobre los días pendientes se calcula la prima vacacional
              utilizando el porcentaje capturado, con un mínimo de
              25%.
            </p>
          </Section>

          <Section title="Prima de antigüedad">
            <p>
              Cuando el supuesto seleccionado puede generar prima de
              antigüedad, Cuenta Clara utiliza 12 días de salario por
              año de servicio y aplica el límite salarial
              correspondiente.
            </p>

            <p className="mt-3">
              La zona salarial se solicita únicamente cuando puede
              influir en este cálculo.
            </p>
          </Section>

          <Section title="Indemnizaciones">
            <p>
              Cuenta Clara separa deliberadamente los escenarios de
              indemnización.
            </p>

            <p className="mt-3">
              Los tres meses de salario integrado se muestran como un
              escenario de referencia cuando la situación capturada es
              un despido.
            </p>

            <p className="mt-3">
              Los llamados “20 días por año” no se presentan como un
              derecho automático en cualquier despido. Se muestran en
              un escenario separado porque su procedencia depende del
              supuesto jurídico concreto.
            </p>
          </Section>

          <Section title="Contratos por tiempo determinado">
            <p>
              A diferencia de calculadoras que solo admiten relaciones
              por tiempo indeterminado, Cuenta Clara permite capturar
              contratos por tiempo determinado.
            </p>

            <p className="mt-3">
              El motor utiliza las fórmulas diferenciadas contempladas
              para los escenarios del artículo 50. Sin embargo, no
              determina si la utilización de un contrato temporal fue
              jurídicamente válida.
            </p>
          </Section>

          <Section title="Otros conceptos">
            <p>
              Cuenta Clara permite sumar días de sueldo pendientes,
              PTU pendiente cuando la persona conoce el monto, bonos,
              comisiones u otras prestaciones ya generadas que se
              capturen expresamente.
            </p>

            <p className="mt-3">
              Estos conceptos no se inventan ni se estiman cuando no
              existe suficiente información.
            </p>
          </Section>

          <Section title="Valores vigentes utilizados para 2026">
            <div className="space-y-3">
              <div className="flex justify-between gap-5 rounded-xl bg-[#f7f9fb] px-4 py-3">
                <span>
                  Salario mínimo general
                </span>

                <strong className="text-[#17212b]">
                  $315.04 / día
                </strong>
              </div>

              <div className="flex justify-between gap-5 rounded-xl bg-[#f7f9fb] px-4 py-3">
                <span>
                  Zona Libre de la Frontera Norte
                </span>

                <strong className="text-[#17212b]">
                  $440.87 / día
                </strong>
              </div>
            </div>

            <p className="mt-4">
              Fuente: Comisión Nacional de los Salarios Mínimos y
              Diario Oficial de la Federación.
            </p>
          </Section>

          <Section title="Impuestos">
            <p>
              Actualmente Cuenta Clara muestra cantidades{" "}
              <strong className="font-semibold text-[#17212b]">
                brutas antes de ISR
              </strong>
              .
            </p>

            <p className="mt-3">
              No presentamos una cifra neta aproximada porque el
              tratamiento fiscal varía entre conceptos y una
              estimación simplificada podría dar una falsa sensación
              de precisión.
            </p>
          </Section>

          <Section title="Lo que Cuenta Clara no determina">
            <ul className="space-y-2">
              <li>
                • Si un despido fue legalmente justificado o
                injustificado.
              </li>
              <li>
                • Si una causa de rescisión puede probarse.
              </li>
              <li>
                • La validez jurídica de un contrato temporal.
              </li>
              <li>
                • Salarios vencidos derivados de un juicio.
              </li>
              <li>
                • Intereses que dependan de un procedimiento laboral.
              </li>
              <li>
                • ISR exacto de una terminación laboral.
              </li>
              <li>
                • Regímenes laborales especiales que no estén
                expresamente soportados.
              </li>
            </ul>
          </Section>

          <Section title="Fuentes">
            <div className="space-y-3">
              <a
                href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf"
                target="_blank"
                rel="noreferrer"
                className="block font-medium text-[#2b6f86] underline decoration-[#b9d0da] underline-offset-4"
              >
                Ley Federal del Trabajo — Cámara de Diputados
              </a>

              <a
                href="https://sjf2.scjn.gob.mx/"
                target="_blank"
                rel="noreferrer"
                className="block font-medium text-[#2b6f86] underline decoration-[#b9d0da] underline-offset-4"
              >
                Semanario Judicial de la Federación — SCJN
              </a>

              <a
                href="https://www.dof.gob.mx/"
                target="_blank"
                rel="noreferrer"
                className="block font-medium text-[#2b6f86] underline decoration-[#b9d0da] underline-offset-4"
              >
                Diario Oficial de la Federación
              </a>
            </div>
          </Section>

          <Section title="¿Encontraste un error?">
            <p>
              Cuenta Clara es un proyecto independiente y puede
              contener errores. Si detectas uno, puedes reportarlo a
              través de AG Solutions para revisarlo contra las fuentes
              correspondientes.
            </p>

            <a
              href="https://agsolutions.dev"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-lg bg-[#163d4f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102f3d]"
            >
              Contactar a AG Solutions
            </a>
          </Section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}