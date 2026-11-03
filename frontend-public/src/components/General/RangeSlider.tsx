import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../../styles/general/rangeSlider.css";

type Props = {
  label: string;
  valueLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  showNumberInputs?: boolean;
};

function RangeSlider({
  label,
  valueLabel = "",
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showNumberInputs = false,
}: Props) {
  const [draft, setDraft] = useState<[string, string]>([
    String(value[0]),
    String(value[1]),
  ]);

  // Synchronizace při změně hodnot zvenčí (slider, reset filtru atd.)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft([String(value[0]), String(value[1])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value[0], value[1]]);

  const updateDraft = (index: 0 | 1, newValue: string) => {
    setDraft((prev) => {
      const next: [string, string] = [...prev];
      next[index] = newValue;
      return next;
    });
  };

  const commitValue = (index: 0 | 1) => {
    const raw = draft[index].trim();
    const parsed = raw === "" ? value[index] : Number(raw);

    if (!Number.isFinite(parsed)) {
      setDraft([String(value[0]), String(value[1])]);
      return;
    }

    const clamped = Math.min(max, Math.max(min, parsed));

    const next: [number, number] =
      index === 0
        ? [Math.min(clamped, value[1]), value[1]]
        : [value[0], Math.max(clamped, value[0])];

    setDraft([String(next[0]), String(next[1])]);

    if (next[0] !== value[0] || next[1] !== value[1]) {
      onChange(next);
    }
  };

  return (
    <div className="range-slider">
      <div className="range-header">
        <span className="range">{label}</span>

        {!showNumberInputs && (
          <span className="range number">
            {value[0]} – {value[1]} <span>{valueLabel}</span>
          </span>
        )}
      </div>

      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(val) => onChange(val as [number, number])}
        className="range-input"
        ariaLabelForHandle={[`${label} minimum`, `${label} maximum`]}
      />

      {showNumberInputs && (
        <div className="range-number-inputs">
          <div className="range-number-field">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft[0]}
              onChange={(e) => updateDraft(0, e.target.value)}
              onBlur={() => commitValue(0)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <span>{valueLabel.trim()}</span>
          </div>

          <span className="range-separator">–</span>

          <div className="range-number-field">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={draft[1]}
              onChange={(e) => updateDraft(1, e.target.value)}
              onBlur={() => commitValue(1)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <span>{valueLabel.trim()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RangeSlider;
