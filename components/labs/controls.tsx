'use client';
import { Slider } from '@/components/ui/slider';
import { useId } from 'react';
export function Range({
  label,
  value,
  min,
  max,
  step = 0.05,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="range-control">
      <div>
        <span id={id}>{label}</span>
        <output>{Number.isInteger(step) ? value : value.toFixed(2)}</output>
      </div>
      <Slider
        aria-labelledby={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
      <div className="range-extents">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
export function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="lab-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
