import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

import { useListingSearch } from "../../hooks/useListingSearch";
import ListingSearch from "../../components/print/ListingSearch";
import ImageSelector from "../../components/print/ImageSelector";
import PrintPreview from "../../components/print/PrintPreview";

import "./print-listing.css";

const BASE_IMAGES = 11;

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

  const [extraImageSlots, setExtraImageSlots] = useState(0);
  const [printOverflow, setPrintOverflow] = useState(false);

  const previousMaxRef = useRef<number | null>(null);

  const photoImages =
    selectedListing?.obrazky.filter(
      (image) => !image.mime_typ?.startsWith("video/"),
    ) ?? [];

  const maxImages = Math.min(photoImages.length, BASE_IMAGES + extraImageSlots);

  const handleSlotsChange = useCallback((slots: number) => {
    setExtraImageSlots((current) => (current === slots ? current : slots));
  }, []);

  const handleOverflowChange = useCallback((overflow: boolean) => {
    setPrintOverflow((current) => (current === overflow ? current : overflow));
  }, []);

  // Při změně inzerátu začneme znovu s limitem 11.
  useEffect(() => {
    previousMaxRef.current = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExtraImageSlots(0);
    setPrintOverflow(false);
  }, [selectedListing?.id]);

  // Automaticky doplňujeme pouze při změně kapacity.
  // Ruční změna výběru se tak sama nevrátí zpět.
  useEffect(() => {
    if (!selectedListing) return;

    if (previousMaxRef.current === maxImages) {
      return;
    }

    previousMaxRef.current = maxImages;

    setSelectedImages((current) => {
      const currentPhotos = current.filter(
        (image) => !image.mime_typ?.startsWith("video/"),
      );

      const kept = currentPhotos.slice(0, maxImages);

      const ids = new Set(kept.map((image) => image.id));

      const missing = photoImages
        .filter((image) => !ids.has(image.id))
        .slice(0, Math.max(0, maxImages - kept.length));

      const next = [...kept, ...missing];

      if (
        next.length === current.length &&
        next.every((image, index) => image.id === current[index].id)
      ) {
        return current;
      }

      return next;
    });
  }, [selectedListing, maxImages, setSelectedImages]);

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
          setExtraImageSlots(0);
          setPrintOverflow(false);
          previousMaxRef.current = null;
        }}
      />

      {selectedListing && !loadingListing && (
        <>
          <ImageSelector
            images={selectedListing.obrazky}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            maxImages={maxImages}
          />

          {selectedImages.length > 0 && (
            <>
              <PrintPreview
                listing={selectedListing}
                images={selectedImages}
                language={language}
                onLanguageChange={setLanguage}
                onExtraImageSlotsChange={handleSlotsChange}
                onOverflowChange={handleOverflowChange}
              />

              {printOverflow && (
                <Alert
                  type="error"
                  showIcon
                  style={{ marginTop: 16 }}
                  message="Obsah inzerátu se nevejde na 4 stránky A4."
                  description="Zkraťte popis nebo detaily inzerátu. Tisk je zablokovaný, aby se část obsahu neořízla."
                />
              )}

              <div className="print-action">
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  disabled={printOverflow}
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
