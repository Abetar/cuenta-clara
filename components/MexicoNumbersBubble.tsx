"use client";

import { useState } from "react";
import { FiArrowUpRight, FiBarChart2, FiX } from "react-icons/fi";

export default function MexicoNumbersBubble() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-[#d8e0e5] bg-white p-5 shadow-[0_18px_50px_rgba(23,33,43,0.16)]">
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Cerrar recomendación"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[#8a949c] transition hover:bg-[#f2f5f7] hover:text-[#17212b]"
        >
          <FiX size={16} />
        </button>

        <div className="flex items-start gap-4 pr-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f7f9] text-[#163d4f]">
            <FiBarChart2 size={20} />
          </div>

          <div>
            <span className="inline-flex rounded-full bg-[#f2f7f9] px-3 py-1 text-xs font-semibold text-[#2b6f86]">
              También puede servirte
            </span>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-[#17212b]">
              ¿Ganas más o menos que otras personas como tú?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#6b7680]">
              Compara tu ingreso con personas de tu edad y estado en México.
            </p>

            <a
              href="https://mexico-en-numeros.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#163d4f] transition hover:text-[#2b6f86]"
            >
              Ver México en Números
              <FiArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
