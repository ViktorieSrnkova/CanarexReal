import { useListingSearch } from "../../hooks/useListingSearch";
import ListingSearch from "../../components/print/ListingSearch";
import ImageSelector from "../../components/print/ImageSelector";
import PrintPreview from "../../components/print/PrintPreview";
import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import "./print-listing.css";
function PrintListing() {
  const {
    options,
    searching,
    loadingListing,
    error,
    selectedListing,
    handleSearch,
    handleSelect,
    handleClear,
    selectedImages,
    language,
    setSelectedImages,
    setLanguage,
  } = useListingSearch();

  return (
    <div>
      <ListingSearch
        options={options}
        searching={searching}
        loadingListing={loadingListing}
        error={error}
        selectedListing={selectedListing}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onClear={() => {
          handleClear();
          setSelectedImages([]);
        }}
      />

      {selectedListing && !loadingListing && (
        <>
          <ImageSelector
            images={selectedListing.obrazky}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />

          {selectedImages.length > 0 && (
            <>
              <PrintPreview
                listing={selectedListing}
                images={selectedImages}
                language={language}
                onLanguageChange={setLanguage}
              />

              <div className="print-action">
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  onClick={() => window.print()}
                >
                  Tisk
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PrintListing;
