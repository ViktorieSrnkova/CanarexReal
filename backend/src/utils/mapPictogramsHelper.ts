export const getSelectedPictogramIds = (
  attributes: Record<string, boolean>,
) => {
  const result = new Set<number>();

  for (const [key, checked] of Object.entries(attributes ?? {})) {
    if (!checked) continue;

    const id = Number(key);
    if (Number.isNaN(id)) continue;

    result.add(id);
  }

  return [...result];
};
