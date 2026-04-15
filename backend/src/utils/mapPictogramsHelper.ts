export const ATTRIBUTE_ID_MAP: Record<number, number> = {
  15: 5,
  16: 6,
};

export const getSelectedPictogramIds = (
  attributes: Record<string, boolean>,
) => {
  const result = new Set<number>();

  for (const [key, checked] of Object.entries(attributes ?? {})) {
    if (!checked) continue;

    const id = Number(key);
    if (Number.isNaN(id)) continue;

    const mappedId = ATTRIBUTE_ID_MAP[id] ?? id;

    result.add(mappedId);
  }

  return [...result];
};
