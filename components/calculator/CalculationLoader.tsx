"use client";

interface CalculationLoaderProps {
  message?: string;
}

export default function CalculationLoader({
  message = "Preparando tu resultado",
}: CalculationLoaderProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-[#dce5e9]" />

        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#163d4f]" />

        <div className="absolute inset-[7px] rounded-full bg-[#f2f7f9]" />
      </div>

      <h2 className="mt-7 text-xl font-semibold tracking-tight text-[#17212b]">
        {message}
      </h2>

      <div className="mt-5 w-full max-w-[260px] overflow-hidden rounded-full bg-[#edf1f3]">
        <div className="calculation-progress h-1 rounded-full bg-[#2b6f86]" />
      </div>

      <p className="mt-4 max-w-xs text-sm leading-6 text-[#7a858e]">
        Estamos revisando tus fechas, prestaciones y el tipo de salida.
      </p>
    </div>
  );
}