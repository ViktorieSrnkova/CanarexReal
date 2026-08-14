import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = React.HTMLAttributes<HTMLTableRowElement> & {
  "data-row-key": string;
  children: React.ReactNode;
};

export function SortableRow({ ...props }: Props) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(props["data-row-key"]),
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    cursor: "default",
    opacity: isDragging ? 0.4 : 1,
  };

  return <tr {...props} ref={setNodeRef} style={style} />;
}
