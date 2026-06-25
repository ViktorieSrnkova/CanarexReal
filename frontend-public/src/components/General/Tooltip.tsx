import "../../styles/general/tooltip.css";

type Props = {
  message: string;
  top?: number;
  left?: number;
  right?: number;
};
function Tooltip({ message, top = 0, left, right }: Props) {
  return (
    <div className="tooltip-wrapper" style={{ top, left, right }}>
      {message}
      <div className="tooltip-arrow" />
    </div>
  );
}

export default Tooltip;
