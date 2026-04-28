import "../../styles/listing/pictograms.css";
import type { PictogramDTO } from "../../types/rawApi";

type Props = {
  pictograms: PictogramDTO[];
  bed: number;
  bath: number;
  size: string;
};

function Pictograms(props: Props) {
  const extraValues: Record<number, string | number> = {
    1: props.bed,
    2: props.bath,
    3: props.size,
  };

  return (
    <div className="pict">
      {props.pictograms.map((p) => (
        <div key={p.id} className="pictogram">
          <div className="top-part">
            <div
              className="icon"
              dangerouslySetInnerHTML={{
                __html: p.iconSvg ?? "",
              }}
            />

            {extraValues[p.id] !== undefined && (
              <span className="number pict-det">{extraValues[p.id]}</span>
            )}
          </div>

          <span className="pict-name">{p.name ?? ""}</span>
        </div>
      ))}
    </div>
  );
}

export default Pictograms;
