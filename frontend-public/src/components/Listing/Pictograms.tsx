import { useLayoutEffect, useRef, useState } from "react";
import "../../styles/listing/pictograms.css";
import type { PictogramDTO } from "../../types/rawApi";

type Props = {
  pictograms: PictogramDTO[];
  bed: number;
  bath: number;
  size: string;
};

function Pictograms(props: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [rowSeparators, setRowSeparators] = useState<number[]>([]);
  const [columnSeparators, setColumnSeparators] = useState<
    { left: number; top: number; height: number }[]
  >([]);

  const extraValues: Record<number, string | number> = {
    1: props.bed,
    2: props.bath,
    3: props.size,
  };

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateSeparators = () => {
      const items = Array.from(
        grid.querySelectorAll<HTMLElement>(".pictogram"),
      );

      // Zjistíme, které položky jsou ve stejném řádku.
      const rows: HTMLElement[][] = [];

      items.forEach((item) => {
        item.classList.remove("has-right-line", "has-bottom-line");

        const top = item.offsetTop;
        const row = rows.find((r) => Math.abs(r[0].offsetTop - top) < 2);

        if (row) {
          row.push(item);
        } else {
          rows.push([item]);
        }
      });

      const verticalLines: {
        left: number;
        top: number;
        height: number;
      }[] = [];

      rows.forEach((row) => {
        row.forEach((item, i) => {
          if (i === row.length - 1) return;

          const nextItem = row[i + 1];

          const itemRight = item.offsetLeft + item.offsetWidth;
          const nextLeft = nextItem.offsetLeft;

          verticalLines.push({
            left: (itemRight + nextLeft) / 2,
            top: item.offsetTop + item.offsetHeight * 0.2,
            height: item.offsetHeight * 0.6,
          });
        });
      });

      setColumnSeparators(verticalLines);

      const separators = rows.slice(0, -1).map((row, i) => {
        const currentBottom = row[0].offsetTop + row[0].offsetHeight;

        const nextTop = rows[i + 1][0].offsetTop;

        return (currentBottom + nextTop) / 2;
      });

      setRowSeparators(separators);
    };

    updateSeparators();

    const observer = new ResizeObserver(updateSeparators);
    observer.observe(grid);

    return () => observer.disconnect();
  }, [props.pictograms]);

  return (
    <div className="pict" ref={gridRef}>
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
      {rowSeparators.map((top, i) => (
        <div
          key={i}
          className="pict-row-separator"
          style={{ top }}
          aria-hidden="true"
        />
      ))}
      {columnSeparators.map((line, i) => (
        <div
          key={`vertical-${i}`}
          className="pict-column-separator"
          style={{
            left: line.left,
            top: line.top,
            height: line.height,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default Pictograms;
