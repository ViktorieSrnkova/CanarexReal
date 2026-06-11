function FieldRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <label style={{ fontWeight: 500 }}>{label}</label>
        {error && <span style={{ color: "red", fontSize: 12 }}>{error}</span>}
      </div>

      {children}
    </div>
  );
}
export default FieldRow;
