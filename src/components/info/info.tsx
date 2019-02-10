import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import {FeatureProperties} from '../../types/featue';

const Wrapper = styled.div`
  width: 300px;
  height: 100vh;

  @media screen and (max-width: 600px) {
    height: 200px;
  }
`;

const Data = styled.div`
  padding: 20px;
`;

const Name = styled.div`
  font-size: 18px;
  margin: 4px 0 8px;
`;

const DataItem = styled.div`
  font-size: 14px;
`;

interface IInfoProps {
  data: FeatureProperties;
}

export const Info: FunctionComponent<IInfoProps> = ({data}) => (
  <Wrapper>
    <Data>
      <Name>
        {data.name}
      </Name>
      <DataItem>
        Population: {data.population}
      </DataItem>
      <DataItem>
        Avarage age: {data.averageAge}
      </DataItem>
      <DataItem>
        Square: {data.square.toFixed(2)} km<sup>2</sup>
      </DataItem>
      <DataItem>
        Perimeter: {data.perimeter.toFixed(2)} km
      </DataItem>
    </Data>
  </Wrapper>
);

