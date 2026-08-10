import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = React.HTMLAttributes<HTMLTableRowElement> & {
  activeId: number | null;
  "data-row-key": string;
  children: React.ReactNode;
};

export function SortableRow({ activeId, ...props }: Props) {
  const { setNodeRef, transform, transition } = useSortable({
    id: String(props["data-row-key"]),
  });
  const id = Number(props["data-row-key"]);
  const isDragging = activeId === id;

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "default",
    opacity: isDragging ? 0.4 : 1,
  };

  return <tr {...props} ref={setNodeRef} style={style} />;
}
