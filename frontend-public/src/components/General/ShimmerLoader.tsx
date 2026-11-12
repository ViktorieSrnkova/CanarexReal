import { useState, type ImgHTMLAttributes } from "react";

import "../../styles/general/shimmer-loader.css";

type ShimmerImageProps = ImgHTMLAttributes<HTMLImageElement>;

function ShimmerLoader({
  className = "",
  onLoad,
  onError,
  src,
  ...props
}: ShimmerImageProps) {
  const [readySrc, setReadySrc] = useState<string | undefined>();
  const [errorSrc, setErrorSrc] = useState<string | undefined>();

  const loaded = !!src && readySrc === src;
  const failed = !!src && errorSrc === src;

  const handleLoad: NonNullable<ShimmerImageProps["onLoad"]> = (event) => {
    const img = event.currentTarget;
    const currentSrc = src;

    onLoad?.(event);

    const prepare = async () => {
      try {
        await img.decode();
      } catch {
        //browser shows default error icon
      }

      if (img.getAttribute("src") !== currentSrc) return;
      if (img.naturalWidth > 0) {
        setReadySrc(currentSrc);
      } else {
        setErrorSrc(currentSrc);
      }
    };

    void prepare();
  };

  return (
    <div
      className={`image-loading-wrapper ${
        loaded ? "is-loaded" : ""
      } ${failed ? "is-error" : ""}`}
    >
      <div className="image-shimmer" aria-hidden="true" />

      <img
        {...props}
        src={src}
        className={className}
        onLoad={handleLoad}
        onError={(event) => {
          setErrorSrc(src);
          onError?.(event);
        }}
        style={{
          ...props.style,
          opacity: loaded ? 1 : 0,
        }}
      />
    </div>
  );
}

export default ShimmerLoader;
