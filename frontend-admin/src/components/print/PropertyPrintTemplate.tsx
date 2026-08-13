/* export interface PrintListingData {
    id: number;
    title: string;
    price: number | null;
    address: string | null;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    description: string | null;
    images: PrintImage[];
}

export interface PrintImage {
    id: number;
    url: string;
    order: number;
}
    
interface PropertyPrintTemplateProps {
    listing: PrintListingData;
}

export const PropertyPrintTemplate = ({
    listing,
}: PropertyPrintTemplateProps) => {
    return (
        <div className="print-page">
            {/* actual A4 design }
        </div>
    );
};

const [selectedImages, setSelectedImages] = useState<PrintImage[]>([]);

<PrintPreview>
    <PropertyPrintTemplate
        listing={{
            ...listing,
            images: selectedImages,
        }}
    />
</PrintPreview>
window.print()

*/
import type { ListingDetail } from "../../types/listings";
import "./printPreview.css";
import PrintPictograms from "./PrintPictograms";
import PrintMap from "./PrintMap";
import EditorRendererWrapper from "./EditorRendererWrapper";
import { languageIds } from "../../types/print";
import { formatMoneyEUR } from "../../utils/formatting";

type Language = "cs" | "sk" | "en";

interface PropertyPrintTemplateProps {
  listing: ListingDetail;
  images: ListingDetail["obrazky"];
  language: Language;
}

const PropertyPrintTemplate = ({
  listing,
  images,
  language,
}: PropertyPrintTemplateProps) => {
  const formatLocation = (address: string, lang: Language) => {
    if (!address) return "";

    return address
      .replace(
        /Kanárske ostrovy|Kanárské ostrovy/g,
        {
          cs: "Kanárské ostrovy",
          sk: "Kanárske ostrovy",
          en: "Canary Islands",
        }[lang],
      )
      .replace(
        /Španělsko|Spain/g,
        {
          cs: "Španělsko",
          sk: "Španielsko",
          en: "Spain",
        }[lang],
      );
  };
  const translateSlogan = (lang: Language) => {
    switch (lang) {
      case "cs":
        return "Váš realitní agent na Tenerife";
      case "en":
        return "Your real estate agent in Tenerife";
      case "sk":
        return "Váš realitný agent na Tenerife";
    }
  };
  return (
    <>
      <div className="print-page-wrapper">
        <section className="print-page">
          <div className="print-header">
            <div className="first-line">
              <div className="logo">
                <img
                  src="/CanarexReal.svg"
                  alt="CanarexReal Logo"
                  className="logo"
                  width={250}
                />
                <p className="logo-text">{translateSlogan(language)}</p>
              </div>

              <ul>
                <li>Av. Quinto Centenario 60</li>
                <li>
                  <span className="number light">386 83</span> Puerto de
                  Santiago
                </li>
                <li>Tenerife Espaňa</li>
                <li>
                  W: +<span className="number light">420 603 257 021</span>
                </li>
                <li>
                  M: +<span className="number light">34 604 198 470</span>
                </li>
                <li>stan@canarexreal.com</li>
                <li>www.canarexreal.com</li>
              </ul>
            </div>

            <div className="third-line">
              <h2>
                {listing.inzeraty_preklady?.find(
                  (t) => t.jazyky_id === languageIds[language],
                )?.titulek || ""}
              </h2>
              <p>
                Index: <span className="number">{listing.index}</span>
              </p>
            </div>
            <h3 className="number bold money-line">
              {formatMoneyEUR(listing.cena_v_eur || 0)}
            </h3>

            <img
              className="main-image"
              src={`${import.meta.env.VITE_API_URL}/api/files/images/${images[0]?.id}`}
              alt="Property"
            />
            <div className="image-row">
              <img
                src={`${import.meta.env.VITE_API_URL}/api/files/images/${images[1]?.id}`}
                alt="Property"
                height={200}
              />
              <img
                src={`${import.meta.env.VITE_API_URL}/api/files/images/${images[2]?.id}`}
                alt="Property"
                height={200}
              />
            </div>
          </div>
        </section>
      </div>
      <div className="print-page-wrapper">
        <section className="print-page">
          <div className="print-image-grid">
            {images.slice(3, 11).map((image, index) => (
              <div
                key={image.id}
                className={`print-image ${index >= 0 ? "print-image-gap" : ""}`}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/api/files/images/${image.id}`}
                  alt="Property"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="print-page-wrapper">
        <section className="print-page">
          <div>
            <div className="top-section">
              <EditorRendererWrapper
                data={
                  listing.inzeraty_preklady.find(
                    (t) => t.jazyky_id === languageIds[language],
                  )?.popis || ""
                }
              />
              <div className="last-row">
                <EditorRendererWrapper
                  data={
                    listing.inzeraty_preklady.find(
                      (t) => t.jazyky_id === languageIds[language],
                    )?.detaily || ""
                  }
                />

                <PrintPictograms
                  pictograms={listing?.inzeraty_piktogramy ?? []}
                  bath={listing.koupelny || 0}
                  bed={listing.loznice || 0}
                  size={`${listing.velikost} m²`}
                  language={language}
                />
              </div>
              <div className="bottom-section">
                <h3>Lokace</h3>
                <PrintMap
                  height="220px"
                  lat={listing.adresy.lat}
                  lng={listing.adresy.lng}
                  zoom={12}
                />
                <p style={{ marginTop: "4px" }}>
                  {formatLocation(listing.adresy?.cela_adresa || "", language)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PropertyPrintTemplate;
