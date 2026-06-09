import { useState } from "react";
import Tooltip from "./Tooltip";
import "../../styles/general/favorited.css";

type Props = {
	favorited: boolean;
	onToggleFavorite?: () => void;
	list: boolean;
	top: number;
	left: number;
};

function Favorite({ favorited, onToggleFavorite, list, top, left }: Props) {
	const [hoveredIcon, setHoveredIcon] = useState<"like" | null>(null);

	return (
		<div
			onClick={onToggleFavorite}
			onMouseEnter={() => setHoveredIcon("like")}
			onMouseLeave={() => setHoveredIcon(null)}
			className="favorited-image"
			style={{ position: "relative" }}>
			<img
				src={favorited ? "/listings/filled-heart.svg" : "/listings/heart.svg"}
				alt="favorite"
				width="22"
				height="22"
				className={list === true ? "favorited-list" : "favorited-item"}
			/>

			{hoveredIcon === "like" && (
				<Tooltip message="Přidat do oblíbených" top={top} left={left} />
			)}
		</div>
	);
}

export default Favorite;
