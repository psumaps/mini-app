import React from 'react';
import Poi from '../../../../network/models/mapi/poi';
import PoiInfo from '../poiInfo';

interface SearchResultProps {
  data: Poi[];
}

const SearchResult = ({ data }: SearchResultProps) => {
  return data.length === 0 ? (
    <p>Ничего не найдено</p>
  ) : (
    data.map((item) => <PoiInfo key={item.properties.id} item={item} />)
  );
};

export default SearchResult;
