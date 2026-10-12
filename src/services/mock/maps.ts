import type { MapsService } from '../interfaces';

const simulateLatency = (ms: number = 220) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  kyiv: { lat: 50.4501, lng: 30.5234 },
  lviv: { lat: 49.8397, lng: 24.0297 },
  dnipro: { lat: 48.4647, lng: 35.0462 },
  odesa: { lat: 46.4825, lng: 30.7233 },
  vinnytsia: { lat: 49.2331, lng: 28.4682 },
  kharkiv: { lat: 49.9935, lng: 36.2304 },
  warsaw: { lat: 52.2297, lng: 21.0122 },
  nairobi: { lat: -1.2921, lng: 36.8219 },
};

export class MockMapsService implements MapsService {
  async calculateRoute(
    originCityId: string,
    destDistrict: string,
  ): Promise<{
    distanceKm: number;
    etaMinutes: number;
    polyline: string;
    routeDescription: string;
  }> {
    await simulateLatency(220);

    // Dynamic realistic variation
    const baseDistance = 3.2;
    const baseEta = 12;

    return {
      distanceKm: baseDistance,
      etaMinutes: baseEta,
      polyline: '_p~iF~ps|U_ul^nnqC_mqNvxq`@',
      routeDescription: `Via Naberezhno-Khreshchatytska St • Fast route with normal traffic (Google Maps Platform Directions API)`,
    };
  }

  getCoordinates(cityId: string, _district?: string): { lat: number; lng: number } {
    return CITY_COORDINATES[cityId.toLowerCase()] || { lat: 50.4501, lng: 30.5234 };
  }
}
