import "../../styles/general/tooltip.css";

type Props = {
  message: string;
  top?: number;
  left?: number;
};
function Tooltip({ message, top = 0, left = 0 }: Props) {
  return (
    <div className="tooltip-wrapper" style={{ top, left }}>
      {message}
      <div className="tooltip-arrow" />
    </div>
  );
}

export default Tooltip;
