"use client";

interface CalculatorProps {
  children?: React.ReactNode;
}

export default function Calculator({
  children,
}: CalculatorProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce3e8] bg-white shadow-[0_18px_60px_rgba(24,39,51,0.08)]">
      {children}
    </div>
  );
}