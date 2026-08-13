import { Alert, Select, Spin, Typography, type SelectProps } from "antd";
import type { ListingDetail } from "../../types/listings";

const { Title } = Typography;

interface ListingSearchProps {
  options: SelectProps["options"];
  searching: boolean;
  loadingListing: boolean;
  error: string | null;
  selectedListing: ListingDetail | null;
  onSearch: (value: string) => void;
  onSelect: (listingId: number) => void;
  onClear: () => void;
}

const ListingSearch = ({
  options,
  searching,
  loadingListing,
  error,
  selectedListing,
  onSearch,
  onSelect,
  onClear,
}: ListingSearchProps) => {
  return (
    <div>
      <Title level={2}>Tisk inzerátu</Title>

      <Select<number>
        showSearch
        allowClear
        placeholder="Vyhledej pomocí indexu"
        filterOption={false}
        onSearch={onSearch}
        onSelect={onSelect}
        onClear={onClear}
        options={options}
        loading={searching}
        notFoundContent={
          searching ? <Spin size="small" /> : "Nebyly nalezeny žádné výsledky"
        }
        style={{ width: "100%", maxWidth: 400 }}
      />

      {error && (
        <Alert type="error" title={error} showIcon style={{ marginTop: 16 }} />
      )}

      {loadingListing && (
        <div style={{ marginTop: 24 }}>
          <Spin />
        </div>
      )}

      {selectedListing && !loadingListing && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>Vybraný index: {selectedListing.index}</Title>
        </div>
      )}
    </div>
  );
};

export default ListingSearch;
