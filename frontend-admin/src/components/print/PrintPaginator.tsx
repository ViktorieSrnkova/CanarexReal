import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ListingDetail } from "../../types/listings";
import ContentRenderer from "./ContentRenderer";
import PrintPictograms from "./PrintPictograms";
import PrintMap from "./PrintMap";

type Language = "cs" | "sk" | "en";
type Images = ListingDetail["obrazky"];

type PageItem =
  | { kind: "html"; html: string }
  | { kind: "details"; html: string }
  | { kind: "pictograms" }
  | { kind: "map" };

type PageData = {
  items: PageItem[];
};

type Props = {
  listing: ListingDetail;
  language: Language;
  description: string;
  details: string;
  formattedAddress: string;
  images: Images;
  onExtraImageSlotsChange?: (slots: number) => void;
  onOverflowChange?: (overflow: boolean) => void;
};

const BASE_IMAGES = 11;
const MAX_CONTENT_PAGES = 2;

// 297 mm - 2 × 20 mm padding.
const PAGE_CONTENT_HEIGHT_MM = 257;

// 186 mm vnitřní šířka stránky.
// Dva sloupce, mezera 2 mm, poměr fotografie 3:2.
const PHOTO_HEIGHT_MM = 61.333;
const PHOTO_GAP_MM = 2;
const PHOTO_TOP_GAP_MM = 4;

function getTextNodes(element: Element): Text[] {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  const result: Text[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) {
    result.push(node as Text);
  }

  return result;
}

function splitHtml(html: string, position: number): [string, string] {
  const template = document.createElement("template");
  template.innerHTML = html;

  const element = template.content.firstElementChild;

  if (!element) return [html, ""];

  const nodes = getTextNodes(element);

  if (!nodes.length) return [html, ""];

  /* const total = nodes.reduce(
    (sum, node) => sum + (node.textContent?.length ?? 0),
    0,
  ); */

  const getBoundary = (offset: number) => {
    let remaining = offset;

    for (const node of nodes) {
      const length = node.textContent?.length ?? 0;

      if (remaining <= length) {
        return { node, offset: remaining };
      }

      remaining -= length;
    }

    const last = nodes[nodes.length - 1];

    return {
      node: last,
      offset: last.textContent?.length ?? 0,
    };
  };

  const middle = getBoundary(position);

  const firstRange = document.createRange();
  firstRange.selectNodeContents(element);
  firstRange.setEnd(middle.node, middle.offset);

  const secondRange = document.createRange();
  secondRange.selectNodeContents(element);
  secondRange.setStart(middle.node, middle.offset);

  const first = element.cloneNode(false) as HTMLElement;
  const second = element.cloneNode(false) as HTMLElement;

  first.appendChild(firstRange.cloneContents());
  second.appendChild(secondRange.cloneContents());

  // Zachováme vnější element (p, ul, ol, h2...).
  return [first.outerHTML, second.outerHTML];
}

function textLength(html: string): number {
  const template = document.createElement("template");
  template.innerHTML = html;

  return template.content.textContent?.length ?? 0;
}

const PrintPaginator = ({
  listing,
  language,
  description,
  details,
  formattedAddress,
  images,
  onExtraImageSlotsChange,
  onOverflowChange,
}: Props) => {
  const compactRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const pictogramsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [compact, setCompact] = useState(true);
  const [pages, setPages] = useState<PageData[]>([{ items: [] }]);
  const [extraSlots, setExtraSlots] = useState(0);

  const extraImages = useMemo(
    () =>
      images
        .filter((image) => !image.mime_typ?.startsWith("video/"))
        .slice(BASE_IMAGES, BASE_IMAGES + extraSlots),
    [images, extraSlots],
  );

  useLayoutEffect(() => {
    let cancelled = false;

    const paginate = () => {
      const compactElement = compactRef.current;
      const source = sourceRef.current;
      const measure = measureRef.current;
      const pictograms = pictogramsRef.current;
      const map = mapRef.current;

      if (!compactElement || !source || !measure || !pictograms || !map) {
        return;
      }

      const pageElement = measure.closest(".print-page");

      if (!pageElement) return;

      const pageStyles = getComputedStyle(pageElement);

      const pageHeight = pageElement.getBoundingClientRect().height;

      const availableHeight =
        pageHeight -
        parseFloat(pageStyles.paddingTop) -
        parseFloat(pageStyles.paddingBottom);

      const compactHeight = compactElement.scrollHeight;

      // Krátký inzerát: zachovat původní rozložení.
      if (compactHeight <= availableHeight + 1) {
        if (cancelled) return;

        setCompact(true);
        setPages([{ items: [] }]);
        setExtraSlots(0);
        onExtraImageSlotsChange?.(0);
        onOverflowChange?.(false);
        return;
      }

      const mmToPx = availableHeight / PAGE_CONTENT_HEIGHT_MM;

      const result: PageData[] = [{ items: [] }];
      let current = result[0];
      let overflow = false;

      const newPage = (): boolean => {
        if (result.length >= MAX_CONTENT_PAGES) {
          overflow = true;
          return false;
        }

        current = { items: [] };
        result.push(current);
        return true;
      };

      const createElement = (item: PageItem): HTMLElement => {
        if (item.kind === "html" || item.kind === "details") {
          const wrapper = document.createElement("div");
          wrapper.className = "print-flow-block tiptap-renderer";
          wrapper.innerHTML = item.html;
          return wrapper;
        }

        if (item.kind === "pictograms") {
          return pictograms.cloneNode(true) as HTMLElement;
        }

        return map.cloneNode(true) as HTMLElement;
      };

      const measureItems = (items: PageItem[]): number => {
        measure.replaceChildren(...items.map(createElement));

        return measure.scrollHeight;
      };

      const fits = (items: PageItem[]): boolean =>
        measureItems(items) <= availableHeight + 1;

      const append = (item: PageItem) => {
        if (overflow) return;

        if (fits([...current.items, item])) {
          current.items.push(item);
          return;
        }

        // Detaily, mapa a piktogramy se nikdy nerozdělují.
        if (item.kind !== "html") {
          if (!newPage()) return;

          if (!fits([item])) {
            overflow = true;
            return;
          }

          current.items.push(item);
          return;
        }

        let remaining = item.html;

        while (remaining && !overflow) {
          const whole: PageItem = {
            kind: "html",
            html: remaining,
          };

          if (fits([...current.items, whole])) {
            current.items.push(whole);
            break;
          }

          const length = textLength(remaining);

          if (length <= 1) {
            if (current.items.length && newPage()) {
              continue;
            }

            overflow = true;
            break;
          }

          let low = 1;
          let high = length - 1;
          let best = 0;

          // Najdeme nejdelší část, která se vejde.
          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const [first] = splitHtml(remaining, mid);

            if (fits([...current.items, { kind: "html", html: first }])) {
              best = mid;
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }

          if (best === 0) {
            if (!newPage()) break;
            continue;
          }

          const [first, second] = splitHtml(remaining, best);

          current.items.push({
            kind: "html",
            html: first,
          });

          remaining = second;

          if (!newPage()) break;
        }
      };

      // Popis -> piktogramy -> detaily -> mapa.
      const descriptionBlocks = source.querySelectorAll<HTMLElement>(
        '[data-print-source="description"] .tiptap-renderer > div > *',
      );

      const detailsBlocks = source.querySelectorAll<HTMLElement>(
        '[data-print-source="details"] .tiptap-renderer > div > *',
      );

      descriptionBlocks.forEach((element) => {
        append({
          kind: "html",
          html: element.outerHTML,
        });
      });

      append({ kind: "pictograms" });

      const detailsHtml = Array.from(detailsBlocks)
        .map((element) => element.outerHTML)
        .join("");

      if (detailsHtml) {
        append({
          kind: "details",
          html: detailsHtml,
        });
      }

      append({ kind: "map" });

      // Volné místo počítáme pouze na čtvrté stránce.
      let slots = 0;

      if (!overflow && result.length === 2) {
        const usedHeight = measureItems(result[1].items);

        const freeHeight = availableHeight - usedHeight;

        const photoHeight = PHOTO_HEIGHT_MM * mmToPx;
        const gap = PHOTO_GAP_MM * mmToPx;
        const topGap = PHOTO_TOP_GAP_MM * mmToPx;

        const usable = freeHeight - topGap;

        const rows =
          usable >= photoHeight
            ? Math.floor((usable + gap) / (photoHeight + gap))
            : 0;

        slots = rows * 2;
      }

      if (cancelled) return;

      setCompact(false);
      setPages(result);
      setExtraSlots(slots);
      onExtraImageSlotsChange?.(slots);
      onOverflowChange?.(overflow);
    };

    paginate();

    void document.fonts.ready.then(() => {
      if (!cancelled) paginate();
    });

    const observer = new ResizeObserver(() => {
      if (!cancelled) paginate();
    });

    if (compactRef.current) {
      observer.observe(compactRef.current);
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [
    listing,
    language,
    description,
    details,
    formattedAddress,
    onExtraImageSlotsChange,
    onOverflowChange,
  ]);

  const pictograms = (
    <PrintPictograms
      pictograms={listing.inzeraty_piktogramy ?? []}
      bath={listing.koupelny || 0}
      bed={listing.loznice || 0}
      size={`${listing.velikost} m²`}
      language={language}
    />
  );

  const map = (
    <>
      <h3>Lokace</h3>
      <PrintMap
        height="220px"
        lat={listing.adresy.lat}
        lng={listing.adresy.lng}
        zoom={12}
      />
      <p style={{ marginTop: 4 }}>{formattedAddress}</p>
    </>
  );

  return (
    <>
      {/* Měřicí DOM se stejnou šířkou jako A4 */}
      <div className="print-measure-root" aria-hidden="true">
        <section className="print-page print-measure-page">
          <div ref={compactRef} className="top-section">
            <ContentRenderer data={description} />

            <div className="last-row">
              <ContentRenderer data={details} />

              <div className="pictograms-float">{pictograms}</div>
            </div>

            <div className="bottom-section">
              <h3>Lokace</h3>
              <div style={{ height: 220 }} />
              <p style={{ marginTop: 4 }}>{formattedAddress}</p>
            </div>
          </div>
        </section>

        <section className="print-page print-measure-page">
          <div ref={sourceRef}>
            <div data-print-source="description">
              <ContentRenderer data={description} />
            </div>

            <div data-print-source="details">
              <ContentRenderer data={details} />
            </div>
          </div>

          <div
            ref={pictogramsRef}
            className="print-pictograms-horizontal print-flow-pictograms"
          >
            {pictograms}
          </div>

          <div ref={mapRef} className="print-flow-map">
            <h3>Lokace</h3>
            <div style={{ height: 220 }} />
            <p style={{ marginTop: 4 }}>{formattedAddress}</p>
          </div>
        </section>

        <section className="print-page print-measure-page">
          <div ref={measureRef} className="print-flow-content" />
        </section>
      </div>

      {compact ? (
        <div className="print-page-wrapper">
          <section className="print-page">
            <div className="top-section">
              <ContentRenderer data={description} />

              <div className="last-row">
                <ContentRenderer data={details} />

                <div className="pictograms-float">{pictograms}</div>
              </div>

              <div className="bottom-section">{map}</div>
            </div>
          </section>
        </div>
      ) : (
        pages.map((page, pageIndex) => (
          <div className="print-page-wrapper" key={`${language}-${pageIndex}`}>
            <section className="print-page">
              <div className="print-flow-content">
                {page.items.map((item, index) => {
                  if (item.kind === "html" || item.kind === "details") {
                    return (
                      <div
                        key={index}
                        className="print-flow-block tiptap-renderer"
                        dangerouslySetInnerHTML={{
                          __html: item.html,
                        }}
                      />
                    );
                  }

                  if (item.kind === "pictograms") {
                    return (
                      <div
                        key={index}
                        className="print-pictograms-horizontal print-flow-pictograms"
                      >
                        {pictograms}
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="print-flow-map">
                      {map}
                    </div>
                  );
                })}

                {pageIndex === 1 && extraImages.length > 0 && (
                  <div className="print-extra-images">
                    {extraImages.map((image) => (
                      <img
                        key={image.id}
                        src={`${import.meta.env.VITE_API_URL}/api/files/images/${image.id}`}
                        alt="Property"
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        ))
      )}
    </>
  );
};

export default PrintPaginator;
