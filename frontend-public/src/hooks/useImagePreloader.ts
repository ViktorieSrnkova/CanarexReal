import { useEffect, useRef, useState } from "react";

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = img.onabort = () => reject(src);
    img.src = src;
  });
}

export default function useImagePreloader(imageList: string[]) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  const stableKey = imageList?.join("|");

  const lastKeyRef = useRef<string | null>(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (!imageList?.length) return;

    // 🔒 prevent rerun for same set
    if (lastKeyRef.current === stableKey) return;

    lastKeyRef.current = stableKey;
    isCancelledRef.current = false;

    (async () => {
      console.log("PRELOAD");

      try {
        await Promise.all(imageList.map(preloadImage));

        if (!isCancelledRef.current) {
          setImagesPreloaded(true);
        }
      } catch {
        if (!isCancelledRef.current) {
          setImagesPreloaded(true);
        }
      }
    })();

    return () => {
      isCancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey]);

  return { imagesPreloaded };
}
