export interface Location {
    id: string;
    name: string;
    type: LocationType;
    countryCode: string;
    lat: number | null;
    lng: number | null;
}
export type LocationType = 'country' | 'region' | 'city' | 'district';
export interface GeoPoint {
    lat: number;
    lng: number;
}
export interface MapBounds {
    northEast: GeoPoint;
    southWest: GeoPoint;
}
export interface MapArticle {
    id: string;
    title: string;
    summary: string | null;
    publishedAt: string;
    category: string | null;
    sentiment: string | null;
    location: GeoPoint;
    locationName: string;
}
export interface MapCluster {
    lat: number;
    lng: number;
    count: number;
    topCategory: string | null;
}
//# sourceMappingURL=location.d.ts.map