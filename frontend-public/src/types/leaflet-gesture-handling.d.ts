import "leaflet";

declare module "leaflet" {
  interface MapOptions {
    gestureHandling?: boolean;
    gestureHandlingOptions?: {
      duration?: number;
      text?: {
        touch?: string;
        scroll?: string;
        scrollMac?: string;
      };
    };
  }
}
