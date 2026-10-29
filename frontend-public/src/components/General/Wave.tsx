type WaveVariant =
  | "gray-white"
  | "white-gray"
  | "small-gray-white"
  | "small-white-gray";

type WaveProps = {
  variant: WaveVariant;
  className?: string;
};

function Wave({ variant, className = "" }: WaveProps) {
  switch (variant) {
    case "small-gray-white":
      return (
        <svg
          className={className}
          width="100%"
          viewBox="0 0 403 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M403.5 -3C378.99 2.5 353.105 9 300 9C197.875 9 203.21 -9 97 -9C46.7879 -9 22.1961 -3.30064 -1 2.70919"
            stroke="currentColor"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "small-white-gray":
      return (
        <svg
          className={className}
          width="100%"
          viewBox="0 0 403 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M404 23C379.46 29.4167 353.543 37 300.372 37C198.121 37 203.462 16 97.1211 16C46.847 16 22.2248 22.6492 -1 29.6607"
            stroke="currentColor"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "gray-white":
      return (
        <svg
          className={className}
          width="100%"
          viewBox="0 0 1440 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M1440 28.856L1439.06 13.8853C1351.92 19.3779 1260.13 25.856 1071.54 25.856C890.111 25.856 804.243 21.368 716.43 16.8755C628.301 12.3668 538.255 7.85596 348.875 7.85596C170.476 7.85596 82.548 13.5243 0 19.5259V-0.14502H1440V28.856Z"
            fill="currentColor"
          />
        </svg>
      );

    case "white-gray":
      return (
        <svg
          className={className}
          width="100%"
          viewBox="0 0 1440 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M348.875 7.85596C538.255 7.85596 628.301 12.3668 716.43 16.8755C804.243 21.368 890.111 25.856 1071.54 25.856C1260.13 25.856 1351.92 19.3779 1439.06 13.8853L1440.94 43.8267C1353.57 49.334 1261.06 55.856 1071.54 55.856C889.42 55.856 803.003 51.3439 714.897 46.8364C627.107 42.3451 537.597 37.856 348.875 37.856C170.553 37.856 83.3777 43.537 1.08887 49.5259L0 34.5649L-1.08887 19.605C81.7763 13.5742 169.692 7.85596 348.875 7.85596Z"
            fill="currentColor"
          />
        </svg>
      );
  }
}

export default Wave;
