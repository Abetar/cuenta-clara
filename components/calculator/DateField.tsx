"use client";

import { useEffect, useState } from "react";

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

function isoToDisplay(value: string) {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}/${year}`;
}

function displayToIso(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return null;

  const [, day, month, year] = match;

  const numericDay = Number(day);
  const numericMonth = Number(month);
  const numericYear = Number(year);

  const date = new Date(numericYear, numericMonth - 1, numericDay, 12);

  const valid =
    date.getFullYear() === numericYear &&
    date.getMonth() === numericMonth - 1 &&
    date.getDate() === numericDay;

  if (!valid) return null;

  return `${year}-${month}-${day}`;
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function DateField({ value, onChange, min }: DateFieldProps) {
  const [displayValue, setDisplayValue] = useState(() => isoToDisplay(value));

  const [error, setError] = useState("");

  useEffect(() => {
    setDisplayValue(isoToDisplay(value));
  }, [value]);

  const validate = (display: string) => {
    if (!display) {
      setError("");
      onChange("");
      return;
    }

    const iso = displayToIso(display);

    if (!iso) {
      setError("Escribe una fecha válida en formato DD/MM/AAAA.");
      return;
    }

    if (min && iso < min) {
      setError("La fecha no puede ser anterior a tu fecha de ingreso.");
      return;
    }

    setError("");
    onChange(iso);
  };

  return (
    <div className="mt-7">
      <div className="flex items-center rounded-xl border border-[#ccd5dc] bg-white px-4 focus-within:border-[#2b6f86]">
        <input
          autoFocus
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="DD/MM/AAAA"
          value={displayValue}
          onChange={(event) => {
            const formatted = formatDateInput(event.target.value);

            setDisplayValue(formatted);

            if (formatted.length === 10 || formatted.length === 0) {
              validate(formatted);
            } else {
              setError("");
              onChange("");
            }
          }}
          onBlur={() => validate(displayValue)}
          className="w-full bg-transparent py-4 text-lg font-medium outline-none placeholder:text-[#aeb8bf]"
        />

        <span className="ml-3 shrink-0 text-xs font-medium text-[#8a949c]">
          DD/MM/AAAA
        </span>
      </div>

      {error && (
        <p className="mt-2 text-xs leading-5 text-[#a0473d]">{error}</p>
      )}
    </div>
  );
}
