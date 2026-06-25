import { useState } from "react";
import Tooltip from "./Tooltip";
import "../../styles/general/favorited.css";
import { useT } from "../../i18n";

type Props = {
  favorited?: boolean;
  onToggleFavorite?: () => void;
  list: boolean;
  top: number;
  left?: number;
  right?: number;
};

function Favorite({
  favorited,
  onToggleFavorite,
  list,
  top,
  left,
  right,
}: Props) {
  const [hoveredIcon, setHoveredIcon] = useState<"like" | null>(null);
  const t = useT();
  return (
    <div
      onClick={onToggleFavorite}
      onMouseEnter={() => setHoveredIcon("like")}
      onMouseLeave={() => setHoveredIcon(null)}
      className="favorited-image"
    >
      <img
        src={favorited ? "/listings/filled-heart.svg" : "/listings/heart.svg"}
        alt="favorite"
        width="22"
        height="22"
        className={list === true ? "favorited-list" : "favorited-item"}
      />

      {hoveredIcon === "like" && (
        <Tooltip
          message={favorited ? t("favorites.remove") : t("favorites.add")}
          top={top}
          left={left}
          right={right}
        />
      )}
    </div>
  );
}

export default Favorite;
