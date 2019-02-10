import React, {Component} from 'react';
import GoogleMapReact, { Coords } from 'google-map-react';
import styled from 'styled-components';
import {Feature} from '../../types/featue';
import {Info} from '../info';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

interface IMapProps {
  center: Coords;
  zoom: number;
}

interface IMapState {
  features: Feature[];
  polygons: any[];
  current: number;
}

export class Map extends Component<IMapProps, IMapState> {
  map: any = null;
  maps: any = null;
  bounds: any = null;

  static defaultProps = {
      center: {
        lat: 52.520008,
        lng: 13.404954
      },
      zoom: 12 
  }

  constructor(props: IMapProps) {
    super(props);

    this.state = {
      features: [],
      polygons: [],
      current: -1
    };
  }

  componentDidMount() {
    Promise.all([this.getMaps(), fetchFeatures()])
      .then(([{ map, maps }, features]) => {
        const polygons = features.map((feature, index) => {
          const color = getColor(feature.properties.averageAge);
          const polygon = new maps.Polygon({
            paths: feature.geometry.coordinates,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: color,
            fillOpacity: 0.35,
            index
          });
          polygon.setMap(map);

          polygon.addListener('click', this.showInfo);

          return polygon;
        });

        this.setState({
          features,
          polygons
        });

        this.bounds = new maps.LatLngBounds();

        polygons.forEach(polygon => {
          polygon.getPath().forEach((point: any) => this.bounds.extend(point))
        });

        map.fitBounds(this.bounds);
      })
      .catch(err => {
        console.error(err);
      })
  }

  showInfo = (e: any) => {
    console.log(e);
    const polygon = this.state.polygons.find(polygon => this.maps.geometry.poly.containsLocation(e.latLng, polygon));

    const feature = this.state.features[polygon.index];
    feature.properties.square = feature.properties.square || this.maps.geometry.spherical.computeArea(polygon.getPath()) * 1e-6;
    feature.properties.perimeter = feature.properties.perimeter || this.maps.geometry.spherical.computeLength(polygon.getPath()) * 1e-3;

    this.setState({
      current: polygon.index
    });
  }

  private getMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.map && this.maps) {
        return resolve({
          map: this.map,
          maps: this.maps
        });
      }

      const timeout = 20000;
      let duration = 0;
      const step = 100;
      const i = setInterval(() => {
        if (this.map && this.maps || duration > timeout) {
          clearInterval(i);
        }

        if (this.map && this.maps) {
          return resolve({
            map: this.map,
            maps: this.maps
          });
        }

        if (duration > timeout) {
          return reject(new Error('Get maps timeout'));
        }

        duration += step;
      }, step);
    });
  }

  onGoogleApplicationLoaded = ({map, maps}: {map: any, maps: any}) => {
    this.map = map;
    this.maps = maps;
  }

  render() {
    return (
      <Wrapper>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAbVwQF6xFJ2dmkZ891JTmXF7C8aUjQ87E' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={this.onGoogleApplicationLoaded}
        >
        </GoogleMapReact>
        {this.state.current >= 0 &&
          <Info data={this.state.features[this.state.current].properties}/>
        }
      </Wrapper>
    );
  }
}

function fetchFeatures(): Promise<Feature[]> {
  return fetch('/frontend-geo.json')
      .then(response => response.json())
      .then((result: any) => {
        return result.features.map(({ type, geometry, properties }: any) => ({
          type,
          properties,
          geometry: {
            type: geometry.type,
            coordinates: geometry.coordinates[0][0].map((point: [number, number]) => ({
              lat: point[1],
              lng: point[0]
            }))
          }
        }));
      });
}

function getColor(avgAge: number): string {
  if (avgAge <= 40) {
    return '#00cb09';
  }
  if (avgAge <= 42) {
    return '#a4cb00';
  }
  if (avgAge <= 43) {
    return '#cb8a00';
  }
  if (avgAge <= 45) {
    return '#cb4f00';
  }
  if (avgAge <= 50) {
    return '#cb0026';
  }

  return '#ffffff';
}
