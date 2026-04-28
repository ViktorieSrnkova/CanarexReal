import React from "react";

type ListItem = {
  content: string;
  items: ListItem[];
};

type ListBlockProps = {
  block: {
    data: {
      style: "ordered" | "unordered";
      items: ListItem[];
    };
  };
};

export const ListRenderer: React.FC<ListBlockProps> = ({ block }) => {
  const Tag = block.data.style === "ordered" ? "ol" : "ul";

  return (
    <Tag style={{ lineHeight: "140%" }}>
      {block.data.items.map((item, idx) => (
        <ListItemRenderer key={idx} item={item} />
      ))}
    </Tag>
  );
};

const ListItemRenderer: React.FC<{ item: ListItem }> = ({ item }) => {
  return (
    <li>
      <span dangerouslySetInnerHTML={{ __html: item.content }} />

      {item.items?.length > 0 && (
        <ul>
          {item.items.map((child, idx) => (
            <ListItemRenderer key={idx} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};
