"use client";

import { useState } from "react";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiClock,
  FiX,
} from "react-icons/fi";

export default function MexicoNumbersBubble() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-[#d8e0e5] bg-white shadow-[0_18px_50px_rgba(23,33,43,0.16)]">
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Cerrar recomendaciones"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[#8a949c] transition hover:bg-[#f2f5f7] hover:text-[#17212b]"
        >
          <FiX size={16} />
        </button>

        <div className="p-5 pb-4 pr-12">
          <span className="inline-flex rounded-full bg-[#f2f7f9] px-3 py-1 text-xs font-semibold text-[#2b6f86]">
            También puede servirte
          </span>

          <p className="mt-2 text-sm leading-5 text-[#6b7680]">
            Más herramientas gratuitas para entender mejor tu dinero.
          </p>
        </div>

        <div className="border-t border-[#e7ecef]">
          {/* México en Números */}
          <a
            href="https://mexico-en-numeros.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 p-5 transition hover:bg-[#f7f9fb]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f7f9] text-[#163d4f]">
              <FiBarChart2 size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold tracking-tight text-[#17212b]">
                  México en Números
                </h3>

                <FiArrowUpRight
                  size={16}
                  className="shrink-0 text-[#8a949c] transition group-hover:text-[#163d4f]"
                />
              </div>

              <p className="mt-1 text-sm leading-5 text-[#6b7680]">
                Compara tu ingreso con personas de tu edad y estado en México.
              </p>
            </div>
          </a>

          {/* ¿Cuánto valía? */}
          <a
            href="https://cuanto-valia.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-4 border-t border-[#e7ecef] p-5 transition hover:bg-[#f7f9fb]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2f7f9] text-[#163d4f]">
              <FiClock size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold tracking-tight text-[#17212b]">
                  ¿Cuánto valía?
                </h3>

                <FiArrowUpRight
                  size={16}
                  className="shrink-0 text-[#8a949c] transition group-hover:text-[#163d4f]"
                />
              </div>

              <p className="mt-1 text-sm leading-5 text-[#6b7680]">
                Descubre cuánto equivalía tu dinero en otros años y cómo cambió
                su poder de compra.
              </p>
            </div>
          </a>
        </div>

        <div className="border-t border-[#e7ecef] bg-[#f7f9fb] px-5 py-3">
          <p className="text-center text-[11px] font-medium text-[#8a949c]">
            Más proyectos de AG Solutions
          </p>
        </div>
      </div>
    </div>
  );
}