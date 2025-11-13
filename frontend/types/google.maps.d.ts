declare namespace google.maps {
  interface MapOptions {
    center: LatLngLiteral;
    zoom: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latLng: LatLngLiteral): void;
  }

  class Marker {
    constructor(options: {
      position: LatLngLiteral;
      map: Map;
      title?: string;
    });
    setPosition(latLng: LatLngLiteral): void;
  }

  class Geocoder {
    geocode(request: { address: string }): Promise<GeocoderResponse>;
  }

  interface GeocoderResult {
    geometry: {
      location: {
        lat(): number;
        lng(): number;
      };
    };
  }

  interface GeocoderResponse {
    results: GeocoderResult[];
  }

  enum MapTypeId {
    ROADMAP = 'roadmap',
    SATELLITE = 'satellite',
    HYBRID = 'hybrid',
    TERRAIN = 'terrain'
  }

  enum Animation {
    BOUNCE = 1,
    DROP = 2
  }
}