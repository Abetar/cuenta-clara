import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description:
    "Conoce cómo Cuenta Clara utiliza y protege la información capturada en la calculadora.",
};

export default function PrivacyPage() {
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
            Volver
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        <p className="text-sm font-medium text-[#2b6f86]">
          Cuenta Clara
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Aviso de privacidad
        </h1>

        <p className="mt-5 text-sm text-[#7a858e]">
          Última actualización: septiembre de 2026
        </p>

        <div className="mt-10 space-y-10 rounded-2xl border border-[#dce3e8] bg-white p-6 text-sm leading-7 text-[#65727c] sm:p-8">
          <section>
            <h2 className="text-xl font-semibold text-[#17212b]">
              Responsable
            </h2>

            <p className="mt-3">
              Cuenta Clara es un proyecto independiente desarrollado
              por AG Solutions.
            </p>

            <p className="mt-3">
              La herramienta no pertenece ni está afiliada a una
              dependencia gubernamental, autoridad laboral, despacho
              jurídico o institución financiera.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Información que introduces en la calculadora
            </h2>

            <p className="mt-3">
              Para realizar la estimación, Cuenta Clara solicita
              información como sueldo, fechas de ingreso y salida,
              tipo de contrato, prestaciones y circunstancias
              generales de la terminación laboral.
            </p>

            <p className="mt-3">
              Esta versión no requiere que proporciones tu nombre,
              CURP, RFC, domicilio, teléfono, correo electrónico ni el
              nombre de tu empleador.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Dónde se guardan tus respuestas
            </h2>

            <p className="mt-3">
              Los datos que capturas en la calculadora se almacenan en
              el almacenamiento local de tu propio navegador
              (“localStorage”) con el objetivo de evitar que pierdas
              tu avance si actualizas o cierras accidentalmente la
              página.
            </p>

            <p className="mt-3">
              Cuenta Clara no utiliza actualmente una base de datos
              propia para guardar esas respuestas.
            </p>

            <p className="mt-3">
              Puedes eliminar la información almacenada utilizando la
              opción “Empezar de nuevo” dentro de la calculadora o
              eliminando los datos del sitio desde la configuración de
              tu navegador.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Finalidad
            </h2>

            <p className="mt-3">
              La información introducida se utiliza exclusivamente
              para efectuar los cálculos solicitados y conservar
              temporalmente el progreso dentro del navegador.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Datos técnicos
            </h2>

            <p className="mt-3">
              Como ocurre con prácticamente cualquier sitio web, el
              proveedor de infraestructura y alojamiento puede
              procesar información técnica necesaria para operar y
              proteger el servicio, como dirección IP, tipo de
              navegador, solicitudes HTTP, fecha y hora de acceso o
              información relacionada con seguridad.
            </p>

            <p className="mt-3">
              Estos datos técnicos dependen de los servicios de
              infraestructura utilizados para publicar Cuenta Clara y
              están sujetos también a las políticas correspondientes
              de dichos proveedores.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Enlaces a terceros
            </h2>

            <p className="mt-3">
              Cuenta Clara contiene enlaces a sitios externos, por
              ejemplo AG Solutions, Ko-fi, fuentes gubernamentales y
              sitios jurídicos oficiales.
            </p>

            <p className="mt-3">
              Al abandonar Cuenta Clara, el tratamiento de información
              se regirá por los avisos y políticas del sitio que
              visites.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              No vendemos tus datos
            </h2>

            <p className="mt-3">
              Cuenta Clara no vende, renta ni comercializa las
              respuestas que introduces en la calculadora.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Menores de edad
            </h2>

            <p className="mt-3">
              La herramienta está diseñada para personas que buscan
              información relacionada con una relación laboral. No
              está diseñada deliberadamente para recopilar datos
              personales de menores.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Cambios a este aviso
            </h2>

            <p className="mt-3">
              Si en el futuro Cuenta Clara incorpora cuentas de
              usuario, analítica, almacenamiento en servidor,
              formularios de contacto u otras funciones que cambien
              el tratamiento de información, este aviso deberá
              actualizarse.
            </p>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Contacto
            </h2>

            <p className="mt-3">
              Para dudas relacionadas con Cuenta Clara puedes contactar
              al responsable del proyecto desde:
            </p>

            <a
              href="https://agsolutions.dev"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex font-medium text-[#2b6f86] underline decoration-[#b9d0da] underline-offset-4"
            >
              agsolutions.dev
            </a>
          </section>

          <section className="border-t border-[#e7ecef] pt-8">
            <h2 className="text-xl font-semibold text-[#17212b]">
              Aviso legal
            </h2>

            <p className="mt-3">
              Cuenta Clara proporciona únicamente estimaciones
              informativas. Los resultados no constituyen asesoría
              legal, fiscal, contable o laboral y no garantizan que una
              autoridad, empleador o tribunal determine los mismos
              montos.
            </p>

            <p className="mt-3">
              Cuando exista una controversia, una oferta importante,
              un despido, una causa de rescisión o dudas sobre los
              conceptos pagados, es recomendable solicitar orientación
              profesional.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}