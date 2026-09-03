import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#dfe5ea] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#6b7680]">
            Cuenta Clara fue creada por{" "}
            <a
              href="https://agsolutions.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#17212b] transition hover:text-[#2b6f86]"
            >
              AG Solutions
            </a>
            .
          </p>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6b7680]">
            <Link
              href="/metodologia"
              className="transition hover:text-[#17212b]"
            >
              Metodología
            </Link>

            <Link
              href="/privacidad"
              className="transition hover:text-[#17212b]"
            >
              Privacidad
            </Link>

            <a
              href="https://agsolutions.dev"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#17212b]"
            >
              Más proyectos
            </a>

            <a
              href="https://ko-fi.com/abrahamgomez96"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#2b6f86] transition hover:text-[#163d4f]"
            >
              Apoyar el proyecto
            </a>
          </nav>
        </div>

        <p className="mt-5 max-w-3xl text-xs leading-5 text-[#8a949c]">
          Herramienta informativa e independiente. No constituye asesoría legal,
          fiscal ni laboral.
        </p>
      </div>
    </footer>
  );
}
