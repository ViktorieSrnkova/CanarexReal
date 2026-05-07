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
};

function RangeSlider({
  label,
  valueLabel = "",
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
}: Props) {
  return (
    <div className="range-slider">
      <div className="range-header">
        <span className="range">{label}</span>
        <span className="range number">
          {value[0]} – {value[1]} <span>{valueLabel}</span>
        </span>
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
    </div>
  );
}

export default RangeSlider;
