
import { Coords } from 'google-map-react';

export interface FeatureGeometry {
  type: string;
  coordinates: Coords[];
}

export interface FeatureProperties {
  averageAge: number;
  name: string;
  population: number;
  square: number;
  perimeter: number;
}

export interface Feature {
  type: string;
  geometry: FeatureGeometry;
  properties: FeatureProperties;
}