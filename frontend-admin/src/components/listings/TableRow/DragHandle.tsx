import { useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";

export function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id: String(id),
  });
  const { active } = useDndContext();
  const isDragging = active?.id === String(id);

  return (
    <span
      {...attributes}
      {...listeners}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        fontSize: 20,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      ☰
    </span>
  );
}
